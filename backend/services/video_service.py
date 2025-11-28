import os
import httpx
import re
from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta
from fastapi import HTTPException
from core.config import settings

YOUTUBE_API_KEY = settings.YOUTUBE_API_KEY
YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/videos"

class VideoService:
    def __init__(self):
        # These are now global constants, no need for instance variables
        pass

    def extract_video_id(self, url: str) -> Optional[str]:
        """
        Extracts the YouTube Video ID from various URL formats.
        Supports:
        - https://www.youtube.com/watch?v=VIDEO_ID
        - https://youtu.be/VIDEO_ID
        - https://www.youtube.com/embed/VIDEO_ID
        """
        # Regex for standard and short URLs
        regex = r"(?:v=|\/)([0-9A-Za-z_-]{11}).*"
        match = re.search(regex, url)
        if match:
            return match.group(1)
        return None

    async def parse_video_url(self, url: str) -> Dict[str, Any]:
        """
        Parses a YouTube URL, fetches metadata from YouTube Data API,
        and returns a dictionary suitable for creating a Video object.
        """
        video_id = self.extract_video_id(url)
        if not video_id:
            raise HTTPException(status_code=400, detail="Invalid YouTube URL")

        if not YOUTUBE_API_KEY:
            # Fallback for development if no API key is set
            print("WARNING: YOUTUBE_API_KEY not set. Returning mock data.")
            return self._get_mock_data(video_id)

        async with httpx.AsyncClient() as client:
            response = await client.get(
                YOUTUBE_API_URL,
                params={
                    "part": "snippet,contentDetails",
                    "id": video_id,
                    "key": YOUTUBE_API_KEY
                }
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Failed to fetch data from YouTube API")

            data = response.json()
            if not data.get("items"):
                raise HTTPException(status_code=404, detail="Video not found on YouTube")

            item = data["items"][0]
            snippet = item["snippet"]
            
            return {
                "youtube_video_id": video_id,
                "title": snippet["title"],
                "channel_name": snippet["channelTitle"],
                "thumbnail_url": snippet["thumbnails"].get("maxres", snippet["thumbnails"]["high"])["url"],
                "description": snippet["description"],
                "published_at": datetime.strptime(snippet["publishedAt"], "%Y-%m-%dT%H:%M:%SZ")
            }

    async def get_channel_id_from_url(self, url: str) -> Optional[str]:
        """
        Resolves a YouTube Channel URL (handle or custom URL) to a Channel ID.
        """
        if not YOUTUBE_API_KEY: return "mock_channel_id"

        # Extract handle or username
        handle_match = re.search(r"youtube\.com\/@([a-zA-Z0-9_.-]+)", url)
        if handle_match:
            handle = handle_match.group(1)
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    "https://www.googleapis.com/youtube/v3/channels",
                    params={"part": "id", "forHandle": f"@{handle}", "key": YOUTUBE_API_KEY}
                )
                if response.status_code == 200:
                    items = response.json().get("items")
                    if items: return items[0]["id"]
        
        # Fallback: Check if it's already a channel ID URL
        id_match = re.search(r"youtube\.com\/channel\/([a-zA-Z0-9_-]+)", url)
        if id_match:
            return id_match.group(1)
            
        return None

    async def get_channel_info(self, channel_id: str) -> Dict[str, Any]:
        """
        Fetches channel details including title, thumbnail, and video count.
        """
        if not YOUTUBE_API_KEY:
            return {
                "title": "Mock Channel",
                "thumbnail_url": "https://via.placeholder.com/88",
                "video_count": 123,
                "uploads_playlist_id": "mock_playlist_id"
            }

        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://www.googleapis.com/youtube/v3/channels",
                params={
                    "part": "snippet,contentDetails,statistics",
                    "id": channel_id,
                    "key": YOUTUBE_API_KEY
                }
            )
            if response.status_code == 200:
                items = response.json().get("items")
                if items:
                    item = items[0]
                    return {
                        "title": item["snippet"]["title"],
                        "thumbnail_url": item["snippet"]["thumbnails"]["default"]["url"],
                        "video_count": int(item["statistics"]["videoCount"]),
                        "uploads_playlist_id": item["contentDetails"]["relatedPlaylists"]["uploads"]
                    }
        return None

    async def get_channel_uploads_playlist_id(self, channel_id: str) -> Optional[str]:
        """
        Fetches the 'Uploads' playlist ID for a given channel.
        """
        info = await self.get_channel_info(channel_id)
        return info.get("uploads_playlist_id") if info else None

    async def get_playlist_videos(self, playlist_id: str, limit: int = 200) -> list[Dict[str, Any]]:
        """
        Fetches videos from a playlist, including duration to identify Shorts.
        Handles pagination to fetch up to `limit` videos.
        """
        if not YOUTUBE_API_KEY:
            # Mock data
            return [self._get_mock_data(f"mock_{i}") for i in range(5)]

        videos = []
        next_page_token = None
        
        async with httpx.AsyncClient() as client:
            while len(videos) < limit:
                # Calculate how many to fetch in this batch (max 50)
                remaining = limit - len(videos)
                max_results = min(remaining, 50)

                # 1. Get Playlist Items (Video IDs)
                params = {
                    "part": "snippet,contentDetails",
                    "playlistId": playlist_id,
                    "maxResults": max_results,
                    "key": YOUTUBE_API_KEY
                }
                if next_page_token:
                    params["pageToken"] = next_page_token

                response = await client.get(
                    "https://www.googleapis.com/youtube/v3/playlistItems",
                    params=params
                )
                
                if response.status_code != 200:
                    print(f"Error fetching playlist items: {response.status_code}")
                    break

                data = response.json()
                items = data.get("items", [])
                next_page_token = data.get("nextPageToken")

                if not items:
                    break

                video_ids = []
                for item in items:
                    # contentDetails.videoId is reliable in playlistItems
                    vid = item["contentDetails"].get("videoId")
                    if vid:
                        video_ids.append(vid)
                
                if not video_ids:
                    break

                # 2. Get Video Details (Duration)
                # YouTube API allows up to 50 IDs per call
                video_response = await client.get(
                    "https://www.googleapis.com/youtube/v3/videos",
                    params={
                        "part": "snippet,contentDetails",
                        "id": ",".join(video_ids),
                        "key": YOUTUBE_API_KEY
                    }
                )

                if video_response.status_code == 200:
                    video_items = video_response.json().get("items", [])
                    for item in video_items:
                        snippet = item["snippet"]
                        content_details = item["contentDetails"]
                        
                        # Skip private/deleted
                        if snippet["title"] == "Private video" or snippet["title"] == "Deleted video":
                            continue

                        try:
                            thumbnail = snippet["thumbnails"].get("maxres") or snippet["thumbnails"].get("high") or snippet["thumbnails"].get("default")
                            duration_str = content_details.get("duration", "PT0S")
                            duration_sec = self._parse_duration(duration_str)

                            videos.append({
                                "youtube_video_id": item["id"],
                                "title": snippet["title"],
                                "channel_name": snippet["channelTitle"],
                                "thumbnail_url": thumbnail["url"] if thumbnail else "",
                                "description": snippet["description"],
                                "published_at": datetime.strptime(snippet["publishedAt"], "%Y-%m-%dT%H:%M:%SZ"),
                                "duration_seconds": duration_sec
                            })
                        except Exception as e:
                            print(f"Error parsing video item: {e}")
                            continue
                
                if not next_page_token:
                    break

        return videos

    def _parse_duration(self, duration: str) -> int:
        """
        Parses ISO 8601 duration (PT#M#S) to seconds.
        Examples: PT1M13S, PT58S, PT1H2M
        """
        import re
        match = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', duration)
        if not match:
            return 0
        
        hours = int(match.group(1) or 0)
        minutes = int(match.group(2) or 0)
        seconds = int(match.group(3) or 0)
        
        return hours * 3600 + minutes * 60 + seconds

    def _get_mock_data(self, video_id: str) -> Dict[str, Any]:
        """Fallback mock data for development"""
        return {
            "youtube_video_id": video_id,
            "title": f"Mock Video Title for {video_id}",
            "channel_name": "Mock Channel",
            "thumbnail_url": "https://via.placeholder.com/1280x720",
            "description": "This is a mock description because YOUTUBE_API_KEY is missing.",
            "published_at": datetime.utcnow()
        }

video_service = VideoService()
