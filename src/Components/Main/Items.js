import React, { memo } from 'react'
import styled, { } from 'styled-components'
import media from 'cssMix/index'
import { BsThreeDots } from 'react-icons/bs'

function Items ({
  list,
  handleImgClick,
  handleRemoveClick,
  clickElementRef,
  reomoveButtonSeq,
  setReomoveButtonSeq
}) {
  return <GamesContainer>
    {
      list.map((v, i) => {
        const itemNum = v.get('itemNum')
        const itemImg = v.get('itemImg')
        const itemName = v.get('itemName')
        const itemPrice = v.get('itemPrice')
        const itemStockStatus = v.get('itemStockStatus')
        const itemLink = v.get('itemLink')
        return <ItemCard key={i}
          backgroundImg={itemImg}
        >
          <div className='gameCardNum' >
            {itemNum}
            <div className='gameCardMoreInfo' ref={clickElementRef} onClick={() => setReomoveButtonSeq(pre => pre === itemNum ? '' : itemNum)} >
              <BsThreeDots/>
            </div>
            {reomoveButtonSeq === itemNum && <div className={'gameCardMenu'} onClick={handleRemoveClick.bind(null, itemNum)}>
                            移除項目
            </div>}
          </div>
          <div className='gameCardimg' onClick={() => handleImgClick(itemLink)} >
            {
              itemStockStatus ? <div className='maintain'>
                {/* <img alt='' src='https://images.cq9web.com/game-lobby/common/maintain.png' /> */}
                <div>缺貨</div>
              </div> : <div className='hoverBg'>
                <div>進入網站</div>
              </div>
            }
          </div>
          <div className='gameCardTitle'>
            {itemPrice}
          </div>
          <div className='gameCardContent'>
            {itemName}
          </div>
        </ItemCard>
      })
    }
  </GamesContainer>
}

export default memo(Items)

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
 .gameCardNum{
    color:${({ theme }) => theme.colors['6']};
    margin-bottom:3px;
    display: flex;
    justify-content:space-between;
    position: relative;
    .gameCardMoreInfo{
        cursor: pointer;
    }
    .gameCardMenu{
        position: absolute;
        right: 0;
        top: 20px;
        background: #de0e35;
        width: 90px;
        height: 30px;
        z-index: 20;
        color: white;
        border-radius: 5px;
        line-height:30px;
        text-align:center;
        cursor: pointer;
    }
    }
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
    .gameCardContent{
        color:#0060a9
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
${media.mobile`
    margin:0 5px 30px 5px;
    `
    }

`
