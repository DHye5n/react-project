package com.example.boardspre.repository;

import com.example.boardspre.entity.FavoriteEntity;
import com.example.boardspre.entity.primarykey.FavoritePk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FavoriteRepository extends JpaRepository<FavoriteEntity, FavoritePk> {
}
