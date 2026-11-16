
from sqlalchemy import create_engine, Column, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

SQLALCHEMY_DATABASE_URL = "sqlite:///./meetings.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class MeetingRecord(Base):
    __tablename__ = "meeting_records"

    id = Column(String, primary_key=True, index=True)
    filename = Column(String)
    transcript = Column(Text)
    summary = Column(Text)
    action_items = Column(Text)
    email = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
