import React from 'react';
import './style.css';

export default function Footer() {

    // event handler: 인스타 아이콘 버튼 클릭 이벤트 처리
    const onInstaIconButtonClickHandler = () => {
        window.open('https://www.instagram.com');
    }
    // event handler: 네이버 아이콘 버튼 클릭 이벤트 처리
    const onNaverIconButtonClickHandler = () => {
        window.open('https://blog.naver.com');
    }
    return (
        <div id='footer'>
            <div className='footer-container'>
                <div className='footer-top'>
                    <div className='footer-logo-box'>
                        <div className='icon-box'>
                            <div className='icon logo-light-icon'></div>
                        </div>
                        <div className='footer-logo-text'>{'DgmFit Board'}</div>
                    </div>
                    <div className='footer-link-box'>
                        <div className='footer-email-link'>{'email : sai4875@naver.com'}</div>
                        <div className='verticalbar'>{' | '}</div>
                        <div className='footer-github-link'>{'github : https://github.com/DHye5n'}</div>
                        <div className='icon-button'>
                            <div className='icon insta-icon' onClick={onInstaIconButtonClickHandler}></div>
                        </div>
                        <div className='icon-button'>
                            <div className='icon naver-blog-icon' onClick={onNaverIconButtonClickHandler}></div>
                        </div>
                    </div>
                </div>
                <div className='footer-bottom'>
                    <div className='footer-copyright'>{'Copyright ⓒ 2023 DgmFit. All Rights Reserved.'}</div>
                </div>
            </div>
        </div>
    )
}