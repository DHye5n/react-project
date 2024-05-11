
import './App.css';
import {Route, Routes} from 'react-router-dom';
import Main from './views/main';
import Authentication from './views/auth';
import Search from './views/search';
import UserP from './views/user';
import Write from './views/board/write';
import Update from './views/board/update';
import Detail from './views/board/detail';
import Container from './layouts/container';
import {
  AUTH_PATH,
  BOARD_DETAIL_PATH,
  BOARD_PATH, BOARD_UPDATE_PATH,
  BOARD_WRITE_PATH,
  MAIN_PATH,
  SEARCH_PATH,
  USER_PATH
} from './constant';
import {useEffect} from 'react';
import {useCookies} from 'react-cookie';
import {useLoginUserStore} from './stores';
import {getSignInUserRequest} from './apis';
import {GetSignInUserResponseDto} from './apis/response/user';
import {ResponseDto} from './apis/response';
import {User} from './types/interface';


// component: Application 컴포넌트
function App() {
  // state: 로그인 유저 전역 상태
  const {setLoginUser, resetLoginUser} = useLoginUserStore();
  // state: cookie 상태
  const [cookies, setCookie] = useCookies();
  // function: get sign in user response 처리 함수
  const getSignInUserResponse = (responseBody: GetSignInUserResponseDto | ResponseDto | null) => {
    if (!responseBody) return;
    const {code} = responseBody;
    if (code === 'AF' || code === 'NU' || code === 'DBE') {
      resetLoginUser();
      return;
    }
    const loginUser: User = { ...responseBody as GetSignInUserResponseDto };
    setLoginUser(loginUser);
  }
  // effect: accessToken cookie 값이 변경될 때마다 실행할 함수
  useEffect(() => {
    if (!cookies.accessToken) {
      resetLoginUser();
      return;
    }
    getSignInUserRequest(cookies.accessToken).then(getSignInUserResponse);
  }, [cookies.accessToken]);

  return (
      <Routes>
        <Route element={<Container/>}>
          <Route path={MAIN_PATH()} element={<Main />} />
          <Route path={AUTH_PATH()} element={<Authentication />} />
          <Route path={SEARCH_PATH(':searchWord')} element={<Search />} />
          <Route path={USER_PATH(':userEmail')} element={<UserP />} />
          <Route path={BOARD_PATH()}>
            <Route path={BOARD_WRITE_PATH()} element={<Write />} />
            <Route path={BOARD_DETAIL_PATH(':boardNumber')} element={<Detail />} />
            <Route path={BOARD_UPDATE_PATH(':boardNumber')} element={<Update />} />
          </Route>
          <Route path='*' element={<h1>404 Not Found</h1>} />
        </Route>
      </Routes>
  );
}

export default App;
