package com.example.boardspre.repository.resultset;

public interface GetBoardResultSet {

    Integer getBoardNumber();
    String getTitle();
    String getContent();
    String getWriteDatetime();
    String getWriterEmail();
    String getWriterNickname();
    String getWriterProfileImage();

}
