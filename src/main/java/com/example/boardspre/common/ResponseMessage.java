package com.example.boardspre.common;

public interface ResponseMessage {

    // HTTP Status 200
    String SUCCESS = "Success.";
    // HTTP Status 400
    String VALIDATION_FAILED = "유효성 검증 실패!";
    String DUPLICATE_EMAIL = "중복된 이메일!";
    String DUPLICATE_NICKNAME = "중복된 닉네임!";
    String DUPLICATE_TEL_NUMBER = "중복된 번호!";
    String NOT_EXISTED_USER = "존재하지 않는 유저!";
    String NOT_EXISTED_BOARD = "존재하지 않는 게시물!";

    // HTTP Status 401
    String SIGN_IN_FAIL = "로그인 실패!";
    String AUTHORIZATION_FAIL = "인증 실패!";

    // HTTP Status 403
    String NO_PERMISSION = "권한 없음!";

    // HTTP Status 500
    String DATABASE_ERROR = "DB 에러!";

}
