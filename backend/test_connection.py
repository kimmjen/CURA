from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import os

# Load environment variables from .env
# Assuming script is run from project root or backend/, we try to find .env in project root
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(project_root, ".env"))

# Fetch variables
USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")

# Construct the SQLAlchemy connection string (Sync for testing)
DATABASE_URL = f"postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}?sslmode=require"

print(f"Connecting to: {DATABASE_URL.replace(PASSWORD, '******')}")

# Create the SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# Test the connection
try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("Connection successful!", result.scalar())
except Exception as e:
    print(f"Failed to connect: {e}")
