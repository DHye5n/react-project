package com.example.boardspre.entity.primarykey;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FavoritePk implements Serializable {

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "board_number")
    private int boardNumber;
}
