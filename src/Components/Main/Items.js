import React, { memo } from "react"
import styled, {  } from 'styled-components'
import media from 'cssMix/index'
import {  } from 'immutable'


export default memo(({ list,
    isLack = true
}) => {
    
    return <GamesContainer>
        {
            list.map((v, i) => {
                return <ItemCard key={i}
                    backgroundImg={'https://www.costco.com.tw/medias/sys_master/images/h7f/h83/11953476272158.jpg'}
                >
                    <div className='gameCardimg'>
                            {isLack && <div className='maintain'>
                                <img alt='' src='https://images.cq9web.com/game-lobby/common/maintain.png' />
                                <div>缺貨</div>
                            </div>
                            }
                        {/* <img className='gameLogo' alt='' src={icon} /> */}
                        <div className='hoverBg'>
                            <div>進入網站</div>
                        </div>
                    </div>
                    <div className='gameCardTitle'>
                        青豆
                    </div>

                </ItemCard>
            })
        }
    </GamesContainer>

})

const GamesContainer = styled.div`
width:100%;
display: flex;
flex-wrap:wrap;
box-sizing:border-box;
/* justify-content:space-between; */
`


const ItemCard = styled.div`
width:173px;
margin:0 10px 40px 10px;
position: relative;
    .gameCardimg{
        width:100%;
        height:172px;
        background:url(${({ backgroundImg }) => backgroundImg});
        background-size: contain;
        background-repeat: no-repeat;
        display: flex;
        align-items:center;
        justify-content:center;
        border-radius:5px;
        margin-bottom:16px;
        font-size:18px;
        cursor: pointer;
        position: relative;
        transform:translate3d(0,0,0);
        .maintain{
            position: absolute;
            width:100%;
            height:100%;
            background:#000000;
            opacity:0.75;
            display: flex;
            align-items:center;
            justify-content:center;
            flex-direction:column;
            font-size:18px;
            color:#ffffff;
            z-index:6;
            >img{
                width:50px;
                height: 50px;
                margin-bottom:16px;
            }
        }
        .gameLogo{
            width:150px;
            height:150px;
        }

        .heart{
            position: absolute;
            top:-10px;
            right:10px;
            z-index:5;
            }
        .hoverBg{
                visibility: hidden;
                position: absolute;
                width:100%;
                height:100%;
                background-image:linear-gradient(to top, #ffc900, #ff8c00);
                opacity:0;
                z-index:4;
                display: flex;
                align-items:center;
                justify-content:center;
                flex-direction:column;
                border-radius:5px;
                font-size:18px;
                color:#ffffff;
                transition:600ms;
                    >svg{
                    height:50px;
                    width:50px;
                    margin-bottom:20px;
                }
            }
            &:hover{
                .hoverBg{
                    transition:300ms;
                    opacity:0.9;
                    visibility: visible;
                }
        }
    
    }
    .gameCardTitle{
    color:${({ theme }) => theme.colors['6']};
    margin-bottom:9px;
    }
    .gameCardType{
    font-size:13px;
    color:${({ theme }) => theme.colors['4']};
    padding:1px 8px;
    border: 1px solid ${({ theme }) => theme.colors['4']};
    border-radius: 12.5px;
    }


    ${media.tablet`
    margin: 0 17px 14px 17px;
    width:166px;
        .gameCardimg{
            margin-bottom:8px;
             .maintain{
                font-size:14px;
                >img{
                    width:42px;
                }
            }
            .gameLogo{
                width:95px;
                height:95px;
            }
            .hoverBg{
                display:none;
            }
           .heart{
               top:-7px;
               right:7px;
           }
        }
        .gameCardTitle{
        margin-bottom:0;
        }
        .gameCardType{
                display:none;           
            }
    `}
${
    media.mobile`
    margin:0 5px 30px 5px;
    `
    }

`


