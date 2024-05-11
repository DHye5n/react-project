package com.example.boardspre.service;

import com.example.boardspre.dto.request.auth.SignInRequestDto;
import com.example.boardspre.dto.request.auth.SignUpRequestDto;
import com.example.boardspre.dto.response.auth.SignInResponseDto;
import com.example.boardspre.dto.response.auth.SignUpResponseDto;
import org.springframework.http.ResponseEntity;

public interface AuthService {

    ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto);
    ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto);

}
