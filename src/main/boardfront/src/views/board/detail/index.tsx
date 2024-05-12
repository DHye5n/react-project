import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import './style.css';
import FavoriteItem from "../../../components/favoriteItem";
import {Board, CommentListItem, FavoriteListItem} from "../../../types/interface";
import CommentItem from "../../../components/commentItem";
import Pagination from "../../../components/pagination";
import defaultProfileImage from 'assets/image/DefaultProfileImage.png';
import {useLoginUserStore} from "../../../stores";
import {useNavigate, useParams} from 'react-router-dom';
import {BOARD_PATH, BOARD_UPDATE_PATH, MAIN_PATH, USER_PATH} from "../../../constant";
import {getBoardRequest, getCommentListRequest, getFavoriteListRequest, increaseViewCountRequest} from "../../../apis";
import GetBoardResponseDto from "../../../apis/response/board/get-board.response.dto";
import {ResponseDto} from "../../../apis/response";
import {GetCommentListResponseDto, IncreaseBoardViewCountResponseDto} from '../../../apis/response/board';
import dayjs from 'dayjs';
import GetFavoriteListResponseDto from "../../../apis/response/board/get-favorite-list.response.dto";

// component: 게시물 상세 컴포넌트
export default function Detail() {
    // state: 게시물 번호 상태
    const { boardNumber } = useParams();
    // state: 로그인 유저 상태
    const { loginUser } = useLoginUserStore();

    // function: Navigate 함수
    const navigator = useNavigate();

    const increaseViewCountResponse = (responseBody: IncreaseBoardViewCountResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'NB') alert('존재하지 않는 게시물');
        if (code === 'DBE') alert('DB 에러입니다.');
    }

    // component: 게시물 상세 상단 컴포넌트
    const BoardDetailTop = () => {

        const [isWriter, setWriter] = useState<boolean>(false);

        const [board, setBoard] = useState<Board | null>(null);

        const [showMore, setShowMore] = useState<boolean>(false);

        const getWriteDatetimeFormat = () => {
            if (!board) return '';
            const date = dayjs(board.writeDatetime);
            return date.format('YYYY. MM. DD');
        }

        // function: getBoardResponse 처리 함수
        const getBoardResponse = (responseBody: GetBoardResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const { code } = responseBody;
            if (code === 'NB') alert('존재하지 않는 게시물입니다.');
            if (code === 'DBE') alert('DB 오류입니다.');
            if (code !== 'SU') {
                navigator(MAIN_PATH());
                return;
            }
            const board: Board = { ...responseBody as GetBoardResponseDto }
            setBoard(board);

            if (!loginUser) {
                setWriter(false);
                return;
            }
            const isWriter = loginUser.email === board.writerEmail;
            setWriter(isWriter);
        }

        // EventHandler
        const onNicknameClickHandler = () => {
            if (!board) return;
            navigator(USER_PATH(board.writerEmail));
        }

        const onProfileImageClickHandler = () => {
            if (!board) return;
            navigator(USER_PATH(board.writerEmail));
        }

        const onMoreButtonClickHandler = () => {
            setShowMore(!showMore);
        }

        const onUpdateButtonClickHandler = () => {
            if (!board || !loginUser) return;
            if (loginUser.email !== board.writerEmail) return;
            navigator(BOARD_PATH() + '/' + BOARD_UPDATE_PATH(board.boardNumber));
        }

        const onDeleteButtonClickHandler = () => {
            if (!board || !loginUser) return;
            if (loginUser.email !== board.writerEmail) return;
            navigator(MAIN_PATH());
        }

        // effect: 게시물 번호 변경될 때마다 게시물 불러오기
        useEffect(() => {
           if (!boardNumber) {
               navigator(MAIN_PATH());
               return;
           }
           getBoardRequest(boardNumber).then(getBoardResponse);
        }, [boardNumber]);

        // rendering
        if (!board) return <></>
        return (
            <div id='board-detail-top'>
                <div className='board-detail-top-header'>
                    <div className='board-detail-title'>
                        {board.title}
                    </div>
                    <div className='board-detail-top-sub-box'>
                        <div className='board-detail-write-info-box'>
                            <div className='board-detail-writer-profile-image'
                                 style={{backgroundImage: `url(${board?.writerProfileImage ? board.writerProfileImage : defaultProfileImage}`}}
                                 onClick={onProfileImageClickHandler}></div>
                            <div className='board-detail-writer-nickname' onClick={onNicknameClickHandler}>
                                {board.writerNickname}
                            </div>
                            <div className='board-detail-info-divider'>{'\|'}</div>
                            <div className='board-detail-write-date'>{getWriteDatetimeFormat()}</div>
                        </div>
                        {isWriter &&
                        <div className='icon-button' onClick={onMoreButtonClickHandler}>
                            <div className='icon more-icon'></div>
                        </div>
                        }
                        {showMore &&
                        <div className='board-detail-more-box'>
                            <div className='board-detail-update-button' onClick={onUpdateButtonClickHandler}>{'수정'}</div>
                            <div className='divider'></div>
                            <div className='board-detail-delete-button' onClick={onDeleteButtonClickHandler}>{'삭제'}</div>
                        </div>
                        }
                    </div>
                </div>
                <div className='divider'></div>
                <div className='board-detail-top-main'>
                    <div className='board-detail-main-text'>{board.content}</div>
                    {board.boardImageList.map(image => <img className='board-detail-main-image' src={image} />)}
                </div>
            </div>
        );
    }

    // component: 게시물 상세 하단 컴포넌트
    const BoardDetailBottom = () => {

        // state: 댓글 textarea 참조 상태
        const commentRef = useRef<HTMLTextAreaElement | null>(null);
        // state: 좋아요리스트 상태
        const [favoriteList, setFavoriteList] = useState<FavoriteListItem[]>([]);
        // state: 좋아요리스트 상태
        const [commentList, setCommentList] = useState<CommentListItem[]>([]);
        // state: 좋아요리스트 상태
        const [isFavorite, setFavorite] = useState<boolean>(false);

        const [showFavorite, setShowFavorite] = useState<boolean>(false);

        const [showComment, setShowComment] = useState<boolean>(false);

        const [comment, setComment] = useState<string>('');

        // function

            const getFavoriteListResponse  = (responseBody: GetFavoriteListResponseDto | ResponseDto | null) => {
                if (!responseBody) return;
                const {code} = responseBody;
                if (code === 'NB') alert('존재하지 않는 게시물');
                if (code === 'DBE') alert('DB 오류입니다.');
                if (code !== 'SU') return;

                const {favoriteList} = responseBody as GetFavoriteListResponseDto;
                setFavoriteList(favoriteList);
                if (!loginUser) {
                    setFavorite(false);
                    return;
                }
                const isFavorite = favoriteList.findIndex(favorite => favorite.email === loginUser.email) !== -1;
                setFavorite(isFavorite);
            }

            const getCommentListResponse  = (responseBody: GetCommentListResponseDto | ResponseDto | null) => {
                if (!responseBody) return;
                const { code } = responseBody;
                if (code === 'NB') alert('존재하지 않는 게시물');
                if (code === 'DBE') alert('DB 오류입니다.');
                if (code !== 'SU') return;

                const { commentList } = responseBody as GetCommentListResponseDto;
                setCommentList(commentList);
            }




        const onFavoriteClickHandler = () => {
            setFavorite(!isFavorite);
        }

        const onShowFavoriteClickHandler = () => {
            setShowFavorite(!showFavorite);
        }

        const onShowCommentClickHandler = () => {
            setShowComment(!showComment);
        }

        const onCommentSubmitButtonClickHandler = () => {
            if (!comment) return;
            alert('댓글작성 완료');
        }

        const onCommentChangeClickHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
            const { value } = event.target;
            setComment(value);
            if (!commentRef.current) return;
            commentRef.current.style.height = 'auto';
            commentRef.current.style.height = `${commentRef.current.scrollHeight}px`;
        }

        useEffect(() => {
            if (!boardNumber) return;
            getFavoriteListRequest(boardNumber).then(getFavoriteListResponse);
            getCommentListRequest(boardNumber).then(getCommentListResponse);
        }, [boardNumber]);
        
        return (
            <div id='board-detail-bottom'>
                <div className='board-detail-bottom-button-box'>
                    <div className='board-detail-button-group'>
                        <div className='icon-button' onClick={onFavoriteClickHandler}>
                            {isFavorite ?
                                <div className='icon favorite-fill-icon'></div> :
                                <div className='icon favorite-light-icon'></div>
                            }
                        </div>
                        <div className='board-detail-bottom-button-text'>{`좋아요 ${favoriteList.length}`}</div>
                        <div className='icon-button' onClick={onShowFavoriteClickHandler}>
                            {showFavorite ?
                                <div className='icon up-light-icon'></div> :
                                <div className='icon down-light-icon'></div>
                            }
                        </div>
                    </div>
                    <div className='board-detail-button-group'>
                        <div className='icon-button'>
                            <div className='icon comment-icon'></div>
                        </div>
                        <div className='board-detail-bottom-button-text'>{`댓글 ${commentList.length}`}</div>
                        <div className='icon-button' onClick={onShowCommentClickHandler}>
                            {showComment ?
                                <div className='icon up-light-icon'></div> :
                                <div className='icon down-light-icon'></div>
                            }
                        </div>
                    </div>
                </div>
                {showFavorite &&
                <div className='board-detail-bottom-favorite-box'>
                    <div className='board-detail-bottom-favorite-container'>
                        <div className='board-detail-bottom-favorite-title'>{'좋아요'}<span className='emphasis'>{favoriteList.length}</span></div>
                        <div className='board-detail-bottom-favorite-contents'>
                            {favoriteList.map(item => <FavoriteItem favoriteListItem={item} />)}
                        </div>
                    </div>
                </div>
                }
                {showComment &&
                <div className='board-detail-bottom-comment-box'>
                    <div className='board-detail-bottom-comment-container'>
                        <div className='board-detail-bottom-comment-title'>{'댓글'}<span className='emphasis'>{commentList.length}</span></div>
                        <div className='board-detail-bottom-comment-list-container'>
                            {commentList.map(item => <CommentItem commentListItem={item}/>)}
                        </div>
                    </div>
                    <div className='divider'></div>
                    <div className='board-detail-bottom-comment-pagination-box'>
                        <Pagination />
                    </div>

                    {loginUser !== null &&
                    <div className='board-detail-bottom-comment-input-box'>
                        <div className='board-detail-bottom-comment-input-container'>
                            <textarea ref={commentRef} className='board-detail-bottom-comment-textarea' placeholder='댓글을 작성해주세요.' value={comment} onChange={onCommentChangeClickHandler} />
                            <div className='board-detail-bottom-comment-button-box'>
                                <div className={comment === '' ? 'disable-button' : 'black-button'} onChange={onCommentSubmitButtonClickHandler}>{'댓글작성'}</div>
                            </div>
                        </div>
                    </div>
                    }
                </div>
                }
            </div>
        );
    };

    // effect: 게시물 번호 바뀔 때마다 게시물 조회 수 증가
    let effectFlag = true;
    useEffect(() => {
        if (!boardNumber) return;
        if (effectFlag) {
            effectFlag = false;
            return;
        }
        increaseViewCountRequest(boardNumber).then(increaseViewCountResponse);
    }, [boardNumber]);

    // render: 게시물 상세 컴포넌트 rendering
    return (
        <div id='board-detail-wrapper'>
            <div className='board-detail-container'>
                <BoardDetailTop/>
                <BoardDetailBottom/>
            </div>
        </div>
    );
}