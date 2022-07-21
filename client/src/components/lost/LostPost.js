import { React, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PostImg from './LostPostImg';
import ModalButton from '../modal/ModalButton';
import LostPostMap from './LostPostMap';
import Loading from '../../_layout/loading/Loading';

export default function InputData() {
  const BTN_CLASS =
    'ml-80 py-2 px-4 mt-1 mb-10 bg-[#ffa000]  hover:bg-[#ffd149] text-white w-28 transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none rounded-lg';
  const BTN_CLASS_DISABLED =
    'ml-80 py-2 px-4 mt-1 mb-10 bg-[#ffd149] text-white w-28 transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none rounded-lg';

  const [animalName, setAnimalName] = useState();
  const [lostDate, setLostDate] = useState('');
  const [phoneNumber2, setPhoneNumber2] = useState();
  const [detail, setDetail] = useState('');
  const [address, setAddress] = useState('');
  const [addressName, setAddressName] = useState('');
  const [radius, setRadius] = useState();
  const [image, setImage] = useState();
  const [btnText, setBtnText] = useState('등록하기');
  const [btnDisabled, setBtnDisabled] = useState(false);

  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleChangeAnimalName = ({ target: { value } }) =>
    setAnimalName(value);

  const handleLostDate = ({ target: { value } }) => setLostDate(value);
  const handlePhoneNumber2 = ({ target: { value } }) => setPhoneNumber2(value);
  const handleDetail = ({ target: { value } }) => setDetail(value);
  const handleRadius = ({ target: { value } }) => setRadius(value);

  const saveImage = async () => {
    const formData = new FormData();
    formData.append('image', image);

    console.log(image);
    try {
      await axios({
        url: `${process.env.REACT_APP_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/lost/upload`,
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        data: formData,
      });
    } catch (error) {
      alert(error);
    }
  };

  const getUserInfo = async () => {
    setIsLoading(true);

    axios
      .get(
        `${process.env.REACT_APP_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/${process.env.REACT_APP_ROUTER_USER}`,
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        },
      )
      .then((res) => {
        console.log(res);
        setUserInfo(res.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    console.log(event.target.innerText);

    if (!animalName || !radius || !addressName || !image || !lostDate) {
      alert('빈칸을 작성해주세요.');
      return;
    }
    setBtnText('등록중...');
    setIsLoading(true);
    setBtnDisabled(true);

    saveImage();
    try {
      setIsLoading(false);

      axios({
        url: `${process.env.REACT_APP_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/lost/post`,
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        data: {
          animalName,
          lostDate,
          address: addressName,
          detail,
          image: image.name,
          processState: 'lost',
          latitude: address.lat,
          longitude: address.lng,
          radius,
        },
      }).then(() => {
        console.log('등록 성공');
        alert('분실 등록이 성공적으로 완료되었습니다.');
        navigate('/lost/list');
      });
    } catch (error) {
      console.log(error);
    }
    console.log(addressName);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div className="flex flex-row justify-center z-0">
      {isLoading ? <Loading /> : null}
      <form className="mt-8">
        <div className="flex flex-col mb-2">
          <div className="flex relative">
            <span className="w-1/3 rounded-l-md inline-flex  items-center px-5 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
              반려 동물 이름
            </span>
            <input
              name="반려 동물 이름"
              value={animalName}
              type="string"
              onChange={handleChangeAnimalName}
              className="text-center rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-3 px-20 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-1 focus:ring-[#ffa000]   focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex flex-col mb-2">
          <div className="flex relative">
            <span className="w-1/3 rounded-l-md inline-flex  items-center px-5 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
              실종 날짜
            </span>

            <input
              type="date"
              value={lostDate}
              onChange={handleLostDate}
              className="text-center rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-3 px-20 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-1 focus:ring-[#ffa000]   focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex flex-col mb-2">
          <div className="flex relative">
            <span className="w-1/3 rounded-l-md inline-flex  items-center px-5 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
              실종 장소
            </span>
            <button
              type="button"
              className="text-center rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-3 px-20 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-1 focus:ring-[#ffa000]   focus:border-transparent"
            >
              <ModalButton
                buttonName="지도 열기"
                title="지도"
                content={
                  <LostPostMap
                    address={address}
                    setAddress={setAddress}
                    addressName={addressName}
                    setAddressName={setAddressName}
                  />
                }
              />
            </button>
          </div>
          <div className="flex relative">
            {addressName && (
              <p className="mx-2 my-1 text-sm text-[#ffa000] text-center">
                반려동물을 잃어버린 장소는 {addressName} 부근입니다.
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col mb-2">
          <div className="flex relative">
            <span className="w-1/3 rounded-l-md inline-flex  items-center px-5 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
              보호자 연락처1
            </span>

            <input
              type="tel"
              value={userInfo.phoneNumber}
              readOnly
              disabled
              className="text-center rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-3 px-20 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-1 focus:ring-[#ffa000]   focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex flex-col mb-2">
          <div className="flex relative">
            <span className="w-1/3 rounded-l-md inline-flex  items-center px-5 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
              보호자 연락처2
            </span>
            <input
              type="phoneNumber"
              value={phoneNumber2}
              onChange={handlePhoneNumber2}
              placeholder="010-1234-5678"
              className="text-center rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-3 px-20 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-1 focus:ring-[#ffa000]   focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex flex-col mb-2">
          <div className="flex relative">
            <span className="w-1/3 rounded-l-md inline-flex  items-center px-5 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
              특이 사항
            </span>
            <input
              type="text"
              value={detail}
              onChange={handleDetail}
              className="text-center rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-3 px-20 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-1 focus:ring-[#ffa000]   focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex flex-col mb-2">
          <div className="flex relative">
            <span className="w-1/3 rounded-l-md inline-flex  items-center px-5 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
              연락받을 반경(km)
            </span>
            <input
              type="number"
              value={radius}
              onChange={handleRadius}
              className="text-center rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-3 px-20 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-1 focus:ring-[#ffa000]   focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex flex-col mb-2">
          <PostImg image={image} setImage={setImage} />
        </div>
        <button
          type="submit"
          onClick={onSubmit}
          disabled={btnDisabled}
          className={btnDisabled ? BTN_CLASS_DISABLED : BTN_CLASS}
        >
          {btnText}
        </button>
      </form>
    </div>
  );
}