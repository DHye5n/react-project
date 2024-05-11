import React, {ChangeEvent, KeyboardEvent, useEffect, useRef, useState} from 'react';
import './style.css';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {
    AUTH_PATH,
    BOARD_DETAIL_PATH, BOARD_PATH,
    BOARD_UPDATE_PATH,
    BOARD_WRITE_PATH,
    MAIN_PATH,
    SEARCH_PATH,
    USER_PATH
} from "../../constant";
import {useCookies} from 'react-cookie';
import {useLoginUserStore} from '../../stores';
import useBoardStore from '../../stores/board.store';
import {fileUploadRequest, postBoardRequest} from '../../apis';
import {PostBoardRequestDto} from '../../apis/request/board';
import {PostBoardResponseDto} from '../../apis/response/board';
import {ResponseDto} from '../../apis/response';

export default function Header() {
    // state: 로그인 유저 상태
    const {loginUser, setLoginUser, resetLoginUser} = useLoginUserStore();

    // state: path 상태
    const {pathname} = useLocation();

    // state: cookie 상태
    const [cookies, setCookie] = useCookies();

    // state: 로그인 상태
    const [isLogin, setLogin] = useState<boolean>(false);

    // state: 인증 페이지 상태
    const [isAuthPage, setAuthPage] = useState<boolean>(false);
    // state: 메인 페이지 상태
    const [isMainPage, setMainPage] = useState<boolean>(false);
    // state: 검색 페이지 상태
    const [isSearchPage, setSearchPage] = useState<boolean>(false);
    // state: 게시물 상세 페이지 상태
    const [isBoardDetailPage, setBoardDetailPage] = useState<boolean>(false);
    // state: 게시물 작성 페이지 상태
    const [isBoardWritePage, setBoardWritePage] = useState<boolean>(false);
    // state: 게시물 수정 페이지 상태
    const [isBoardUpdatePage, setBoardUpdatePage] = useState<boolean>(false);
    // state: 유저 페이지 상태
    const [isUserPage, setUserPage] = useState<boolean>(false);



    // funtion: Navigate
    const navigate = useNavigate();

    // event handler: Logo Click
    const onLogoClickHandler = () => {
        navigate(MAIN_PATH());
    }

    // component: SearchButton Component
    const SearchButton = () => {
        // state: 검색어 버튼 요소 참조 상태
        const searchButtonRef = useRef<HTMLDivElement | null>(null);
        // state: SearchButton state
        const [status, setStatus] = useState<boolean>(false);
        const [word, setWord] = useState<string>('');
        const {searchWord} = useParams();
        const onSearchWordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            setWord(value);
        };

        const onSearchWordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key !== 'Enter') return;
            if (!searchButtonRef) return;
            searchButtonRef.current?.click();
        };
        // event handler: Search Icon click event
        const onSearchButtonClickHandler = () => {
            if (!status) {
                setStatus(!status);
                return;
            }
            navigate(SEARCH_PATH(word));
        };

        // effect: 검색어 path variable 변경될 때마다 실행될 함수
        useEffect(() => {
            if (searchWord) {
                setWord(searchWord);
                setStatus(true);
            }
        }, [searchWord]);

        if (!status)

        return (
          <div className='icon-button' onClick={onSearchButtonClickHandler}>
              <div className='icon search-light-icon'></div>
          </div>
        );
        return (
          <div className='header-search-input-box'>
              <input className='header-search-input' type='text' placeholder='검색어를 입력해주세요.'
                     value={searchWord} onChange={onSearchWordChangeHandler} onKeyDown={onSearchWordKeyDownHandler}/>
              <div ref={searchButtonRef} className='icon-button' onClick={onSearchButtonClickHandler}>
                  <div className='icon search-light-icon'></div>
              </div>
          </div>
        );
    };

    // component: 마이페이지 버튼 컴포넌트
    const MyPageButton = () => {

        const {userEmail} = useParams();

        // event handler: 마이페이지 클릭 이벤트 처리 함수
        const onMyPageButtonClickHandler = () => {
            if (!loginUser) return;
            const {email} = loginUser;
            navigate(USER_PATH(email));
        };

        const onSignOutButtonClickHandler = () => {
            resetLoginUser();
            setCookie('accessToken', '', { path: MAIN_PATH(), expires: new Date() })
            navigate(MAIN_PATH());
        };

        const onSignInButtonClickHandler = () => {
            navigate(AUTH_PATH());
        };

        if (isLogin && userEmail === loginUser?.email)
            return <div className='white-button' onClick={onSignOutButtonClickHandler}>{'로그아웃'}</div>;

        if (isLogin)
            return <div className='white-button' onClick={onMyPageButtonClickHandler}>{'마이페이지'}</div>;
            return <div className='black-button' onClick={onSignInButtonClickHandler}>{'로그인'}</div>;

    };
    // component: 업로드 버튼 컴포넌트
    const UploadButton = () => {

        const {title, content, boardImageFileList, resetBoard} = useBoardStore();

        // function: post board response 처리 함수
        const postBoardResponse = (responseBody: PostBoardResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const { code } = responseBody;
            if (code === 'AF' || code === 'NU') navigate(AUTH_PATH());
            if (code === 'VF') alert('제목과 내용은 필수입니다.');
            if (code === 'DBE') alert('DB 오류입니다.');
            if (code !== 'SU') return;

            resetBoard();
            if (!loginUser) return;
            const { email } = loginUser;
            navigate(USER_PATH(email));
        }

        // event handler: 업로드 버튼 클릭 이벤트 처리
        const onUploadButtonClickHandler = async () => {
            const accessToken = cookies.accessToken;
            if (!accessToken) return;

            const boardImageList: string[] = [];

            // forEach 문은 동기 처리가 되지 않음
            for (const file of boardImageFileList) {
                const data = new FormData();
                data.append('file', file);

                const url = await fileUploadRequest(data);
                if (url) boardImageList.push(url);
            }

            const requestBody: PostBoardRequestDto = {
                title, content, boardImageList
            }
            postBoardRequest(requestBody, accessToken).then(postBoardResponse);
        }

        if (title && content)

        return <div className='black-button' onClick={onUploadButtonClickHandler}>{'업로드'}</div>;
        return <div className='disable-button'>{'업로드'}</div>;

    };

    // effect: path가 변경될 때마다 실행될 함수
    useEffect(() => {
        const isAuthPage = pathname.startsWith(AUTH_PATH());
        setAuthPage(isAuthPage);
        const isMainPage = pathname === MAIN_PATH();
        setMainPage(isMainPage);
        const isSearchPage = pathname.startsWith(SEARCH_PATH(''));
        setSearchPage(isSearchPage);
        const isBoardDetailPage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_DETAIL_PATH(''));
        setBoardDetailPage(isBoardDetailPage);
        const isBoardWritePage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_WRITE_PATH());
        setBoardWritePage(isBoardWritePage);
        const isBoardUpdatePage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_UPDATE_PATH(''));
        setBoardUpdatePage(isBoardUpdatePage);
        const isUserPage = pathname.startsWith(USER_PATH(''));
        setUserPage(isUserPage);
    }, [pathname]);

    // effect: path가 변경될 때마다 실행될 함수
    useEffect(() => {

    }, [pathname]);
    // effect: login user가 변경될 때마다 실행될 함수
    useEffect(() => {
        setLogin(loginUser !== null);
    }, [loginUser]);

    return (
        <div id='header'>
            <div className='header-container'>
                <div className='header-left-box' onClick={onLogoClickHandler}>
                    <div className='icon-box'>
                        <div className='icon logo-dark-icon'></div>
                    </div>
                    <div className='header-logo'>{'DgmFit Board'}</div>
                </div>
                <div className='header-right-box'>
                    {(isAuthPage || isMainPage || isSearchPage || isBoardDetailPage) && <SearchButton />}
                    {(isMainPage || isSearchPage || isBoardDetailPage || isUserPage) && <MyPageButton />}
                    {(isBoardWritePage || isBoardUpdatePage) && <UploadButton />}
                </div>
            </div>
        </div>
    );
}