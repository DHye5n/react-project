package com.example.boardspre.dto.request.auth;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
public class SignInRequestDto {

    @NotNull
    private String email;
    @NotBlank
    private String password;
}
