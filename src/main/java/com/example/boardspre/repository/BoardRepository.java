package com.example.boardspre.repository;

import com.example.boardspre.entity.BoardEntity;
import com.example.boardspre.repository.resultset.GetBoardResultSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardRepository extends JpaRepository<BoardEntity, Integer> {


    // 네이티브 쿼리
    @Query(value = "SELECT " +
            "B.board_number AS boardNumber, " +
            "B.title AS title, " +
            "B.content AS content, " +
            "B.write_datetime AS writeDatetime, " +
            "B.writer_email AS writerEmail, " +
            "U.nickname AS writerNickname, " +
            "U.profile_IMAGE AS writerProfileImage " +
            "FROM board AS B " +
            "INNER JOIN user AS U " +
            "ON B.writer_email = U.email " +
            "WHERE board_number = ?1 ",
            nativeQuery = true

    )
    GetBoardResultSet getBoard(Integer boardNumber);

    BoardEntity findByBoardNumber(Integer boardNumber);

    boolean existsByBoardNumber(Integer boardNumber);
}
