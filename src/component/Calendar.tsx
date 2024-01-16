import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styles from './Calendar.module.scss';

interface ViewDays { // 달력에 표시할 날짜
  last: number[], // 지난달
  this: number[], // 이번달
  next: number[], // 다음달
}

interface SelectInfo { // 사용자가 선택한 정보
  year: number, // 년도
  month: number, // 월 ( -1 )
  date: Date, // 날짜
  isDateType: boolean, // 사용자가 선택 or 입력한 날짜가 올바른 날짜 형식인지
}

interface Props {
  userDate: string,
  setUserDate: Dispatch<SetStateAction<string>>,
}

export const Calendar = ({ userDate, setUserDate }: Props): JSX.Element => {

  // 년도 Option Ref
  const yearRef = useRef<HTMLUListElement>(null);

  // 월 Option Ref
  const monthRef = useRef<HTMLUListElement>(null);

  // 년도, 월 Select Option Visible
  const [optionVisible, setOptionVisible] = useState({ year: false, month: false });

  // 선택한 year, month, date, isDate(입력한 날짜가 Date 타입인 경우 true)
  const [selectedInfo, setSelectedInfo] = useState<SelectInfo>({ year: 0, month: 0, date: new Date(), isDateType: false });

  // 달력에 표시할 날짜
  const [viewDays, setViewDays] = useState<ViewDays>({ last: [], this: [], next: [] });

  // 달력날짜 클릭
  const changeDateFnc = (day: number) => {
    let newMonth = selectedInfo.month < 9 ? `0${selectedInfo.month+1}` : selectedInfo.month+1 ;
    let newDay = day < 10 ? `0${day}` : day;
    setUserDate(`${selectedInfo.year}.${newMonth}.${newDay}`);
  }

  // 지난달 달력으로 이동
  const moveToLastMonth = () => {
    // 현재 선택된 달이 1월이면 년도 범위내에서 지난연도 12월로 보여줌
    if (selectedInfo.month === 0 && selectedInfo.year !== new Date().getFullYear()-100)
      setSelectedInfo({ ...selectedInfo, year: selectedInfo.year-1, month: 11 });

    // 현재 선택된 달이 1월이 아니면 이전달을 보여줌
    else if (selectedInfo.month !== 0)
      setSelectedInfo({ ...selectedInfo, month: selectedInfo.month-1 });
  }

  // 다음달 달력으로 이동
  const moveToNextMonth = () => {
    // 현재 선택된 달이 12월이면 년도 범위내에서 지난연도 12월로 보여줌
    if (selectedInfo.month === 11 && selectedInfo.year !== new Date().getFullYear())
      setSelectedInfo({ ...selectedInfo, year: selectedInfo.year+1, month: 0 });

    // 현재 선택된 달이 1월이 아니면 이전달을 보여줌
    else if (selectedInfo.month !== 11)
      setSelectedInfo({ ...selectedInfo, month: selectedInfo.month+1 });
  }

  // Month options
  const MonthOptionLoop = (): JSX.Element[] => {
    const monthArr: JSX.Element[] = [];
    for (let i=1; i<=12; i++) {
      monthArr.push(
        <li key={i} className={selectedInfo.month === (i-1) ? styles.selected_option : styles.option}
          onClick={() => {
            setSelectedInfo({ ...selectedInfo, month: i-1});
            setOptionVisible({ month: false, year: false });
          }}
          >{i}월</li>
      )
    }
    return monthArr;
  }

  // Year options
  const YearOptionLoop = (): JSX.Element[] => {
    const yearArr: JSX.Element[] = [];
    const thisYear = new Date().getFullYear();
    for (let i=thisYear; i>=thisYear-100; i--) {
      yearArr.push(
        <li key={i} className={selectedInfo.year === i ? styles.selected_option : styles.option}
          onClick={() => {
            setSelectedInfo({ ...selectedInfo, year: i});
            setOptionVisible({ month: false, year: false });
          }}
          >{i}년</li>
      )
    }
    return yearArr;
  }

  // select Box 년도, 월 Option 처음에 보여줄 때 value scroll 자동 조절
  useEffect(() => {
    if (optionVisible.year) {
      const maxYear = new Date().getFullYear();
      let scrollY = (maxYear - selectedInfo.year - 3) * 31;
      yearRef.current?.scrollTo(0, scrollY);
    } else if (optionVisible.month) {
      let scrollY = (selectedInfo.month - 3) * 31;
      monthRef.current?.scrollTo(0, scrollY);
    }
  }, [optionVisible.year, optionVisible.month])

  // 달력의 년도 or 월 변경 => 달력에 표시할 날짜를 다시 만듦
  useEffect(() => {

    const newDays: ViewDays = { last: [], this: [], next: [] }; // 달력에 표시할 날짜
    const startDays = new Date(selectedInfo.year, selectedInfo.month, 1).getDay(); // 선택한 달의 시작 요일
    let outDate = new Date(selectedInfo.year, selectedInfo.month, -startDays); // 달력에 보여줄 날짜 시작점
    for (let i=0; i<42; i++) {
      outDate.setDate(outDate.getDate() + 1);
      
      // 선택한 달이 1월이 아니고 outDate가 지난달인 경우 or 선택한 달리 1월이고 outDate가 12월인 경우
      if ((selectedInfo.month !== 0 && outDate.getMonth() === selectedInfo.month-1) || (selectedInfo.month === 0 && outDate.getMonth() === 11))
        newDays.last.push(outDate.getDate()); // 지난달에 추가

      // 선택한 달과 outDate의 달이 같은 경우
      else if ((selectedInfo.month === outDate.getMonth()))
        newDays.this.push(outDate.getDate()); // 이번달에 추가

      // 선택한 달이 12월이 아니고 outDate가 다음달인 경우 or 선택한 달이 12월이고 outDate가 1월인 경우
      else 
        newDays.next.push(outDate.getDate()); // 다음달에 추가
    }
    setViewDays(newDays);


  }, [selectedInfo.year, selectedInfo.month]);

  // 날짜가 변경 될 때 ( 달력 선택 or 사용자 입력 )
  useEffect(() => {

    // 사용자가 입력한 날짜
    const newUserDate: Date = new Date(userDate);

    // 사용자가 데이터 형식이 아닌 잘못된 값을 보내면 달력은 오늘 날짜 기준으로 보여줌
    if (newUserDate.toString() !== 'Invalid Date') {
      setSelectedInfo({ year: newUserDate.getFullYear(), month: newUserDate.getMonth(), date: newUserDate, isDateType: true });
    } else {
      const today: Date = new Date();
      setSelectedInfo({ year: today.getFullYear(), month: today.getMonth(), date: today, isDateType: false });
    }

    // 년도, 월 Select Option hidden
    setOptionVisible({ year: false, month: false });

  }, [userDate]);

  return (
    <div className={styles.container}>

      {/* 상단 네비 */}
      <div className={styles.nav_wrap}>

        <div className={styles.arrow_left_btn}>
          <span onClick={moveToLastMonth} className="material-icons-outlined">navigate_before</span>
        </div>

        <div className={styles.select_wrap}>
          <div onClick={() => setOptionVisible({ ...optionVisible, year: !optionVisible.year })} className={styles.selected_value} id={optionVisible.year ? styles.select_filled : ''}>
            <p>{selectedInfo.year}년</p>
            <span className="material-icons-outlined">expand_more</span>
          </div>
          <ul className={styles.option_list} ref={yearRef} hidden={!optionVisible.year}>
            {YearOptionLoop()}
          </ul>
        </div>

        <div className={styles.select_wrap}>
          <div onClick={() => setOptionVisible({ ...optionVisible, month: !optionVisible.month })} className={styles.selected_value} id={optionVisible.month ? styles.select_filled : ''}>
            <p>{selectedInfo.month+1}월</p>
            <span className="material-icons-outlined">expand_more</span>
          </div>
          <ul className={styles.option_list} ref={monthRef} hidden={!optionVisible.month}>
            {MonthOptionLoop()}
          </ul>
        </div>

        <div className={styles.arrow_right_btn}>
          <span onClick={moveToNextMonth} className="material-icons-outlined">navigate_next</span>
        </div>

      </div>

      {/* 요일 */}
      <div className={styles.week_wrap}>
        <span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span>
      </div>

      {/* 날짜 */}
      <div className={styles.days_wrap}>
        
        {/* 지난달 영역 */}
        {viewDays.last.map(day => <span onClick={moveToLastMonth} key={day} className={styles.last_days}>{day}</span>)}

        {/* 이번달 영역 */}
        {viewDays.this.map(day => {
          let isToday: boolean = false; // 오늘 날짜 인지 체크
          let isSelected: boolean = false; // 선택한 날짜인지 체크

          if (selectedInfo.isDateType 
            && selectedInfo.year === selectedInfo.date.getFullYear()
            && selectedInfo.month === selectedInfo.date.getMonth()
            && day === selectedInfo.date.getDate()) {
              isSelected = true;
          } else {
            const today: Date = new Date();
            const thisDateStr: string = `${selectedInfo.year}-${selectedInfo.month}-${day}`;
            const todayStr: string = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

            if (thisDateStr === todayStr) isToday = true;
          }

          return <span onClick={() => changeDateFnc(day)} key={day} className={isSelected ? styles.selected_day : styles.this_days}
            style={isToday ? {fontWeight: 'bold'} : {fontWeight: 'normal'}}>{day}</span>
        })}

        {/* 다음달 영역 */}
        {viewDays.next.map(day => <span onClick={moveToNextMonth} key={day} className={styles.next_days}>{day}</span>)}
        
      </div>

    </div>
  );
}

