package com.example.boardspre.dto.response.board;

import com.example.boardspre.common.ResponseCode;
import com.example.boardspre.common.ResponseMessage;
import com.example.boardspre.dto.response.ResponseDto;
import com.example.boardspre.repository.resultset.GetFavoriteListResultSet;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


public class IncreaseViewCountResponseDto extends ResponseDto {

    private IncreaseViewCountResponseDto() {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }

    public static ResponseEntity<IncreaseViewCountResponseDto> success() {
        IncreaseViewCountResponseDto result = new IncreaseViewCountResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> noExistBoard() {
        ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_BOARD, ResponseMessage.NOT_EXISTED_BOARD);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }
}
