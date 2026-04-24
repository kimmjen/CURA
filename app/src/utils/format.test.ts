import { describe, expect, it, beforeAll, afterAll, vi } from 'vitest';
import { formatDuration, formatViewCount, formatRelativeTime } from './format';

describe('formatDuration', () => {
    it('returns 0:00 for missing or invalid input', () => {
        expect(formatDuration(0)).toBe('0:00');
        expect(formatDuration(NaN)).toBe('0:00');
    });

    it('formats sub-minute durations', () => {
        expect(formatDuration(5)).toBe('0:05');
        expect(formatDuration(59)).toBe('0:59');
    });

    it('formats minute-range durations without hours', () => {
        expect(formatDuration(60)).toBe('1:00');
        expect(formatDuration(3599)).toBe('59:59');
    });

    it('formats hour-range durations with hh:mm:ss', () => {
        expect(formatDuration(3600)).toBe('1:00:00');
        expect(formatDuration(3661)).toBe('1:01:01');
        expect(formatDuration(86399)).toBe('23:59:59');
    });
});

describe('formatViewCount', () => {
    it('leaves small counts as-is', () => {
        expect(formatViewCount(0)).toBe('0');
        expect(formatViewCount(999)).toBe('999');
    });

    it('formats thousands with K', () => {
        expect(formatViewCount(1000)).toBe('1.0K');
        expect(formatViewCount(15400)).toBe('15.4K');
    });

    it('formats millions with M', () => {
        expect(formatViewCount(1_000_000)).toBe('1.0M');
        expect(formatViewCount(2_500_000)).toBe('2.5M');
    });
});

describe('formatRelativeTime', () => {
    // Freeze "now" to a deterministic value so the test output is stable
    // regardless of when the suite runs.
    const FAKE_NOW = new Date('2026-06-15T12:00:00Z');

    beforeAll(() => {
        vi.useFakeTimers();
        vi.setSystemTime(FAKE_NOW);
    });

    afterAll(() => {
        vi.useRealTimers();
    });

    it('returns Today for same-day timestamps', () => {
        expect(formatRelativeTime('2026-06-15T08:00:00Z')).toBe('Today');
    });

    it('returns Yesterday for one day back', () => {
        expect(formatRelativeTime('2026-06-14T12:00:00Z')).toBe('Yesterday');
    });

    it('bucket-rounds to days/weeks/months/years', () => {
        expect(formatRelativeTime('2026-06-12T12:00:00Z')).toBe('3 days ago');
        expect(formatRelativeTime('2026-06-01T12:00:00Z')).toBe('2 weeks ago');
        expect(formatRelativeTime('2026-04-01T12:00:00Z')).toBe('2 months ago');
        expect(formatRelativeTime('2024-06-15T12:00:00Z')).toBe('2 years ago');
    });
});
