package com.example.boardspre.service;

import com.example.boardspre.dto.request.board.PostBoardRequestDto;
import com.example.boardspre.dto.response.board.GetBoardResponseDto;
import com.example.boardspre.dto.response.board.PostBoardResponseDto;
import org.springframework.http.ResponseEntity;

public interface BoardService {


    ResponseEntity<? super GetBoardResponseDto> getBoard(Integer boardNumber);
    ResponseEntity<? super PostBoardResponseDto> postBoard(PostBoardRequestDto dto, String email);

}
