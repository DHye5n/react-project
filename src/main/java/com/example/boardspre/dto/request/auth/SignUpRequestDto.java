package com.example.boardspre.dto.request.auth;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.*;

@Data
@NoArgsConstructor
public class SignUpRequestDto {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 8, max = 20)
    private String password;

    @NotBlank
    private String nickname;

    @NotBlank
    @Pattern(regexp = "^[0-9]{11,13}$")
    private String telNumber;

    @NotBlank
    private String zonecode;
    @NotBlank
    private String address;
    @NotBlank
    private String addressDetail;

    @NotNull
    @AssertTrue
    private Boolean agreedPersonal;
}
