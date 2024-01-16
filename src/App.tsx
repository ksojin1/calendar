import React, { useState } from 'react';
import { Calendar } from './component/Calendar';

function App() {

  // 달력표시
  const [visible, setVisible] = useState<boolean>(false);
  const [userDate, setUserDate] = useState<string>('');


  return (
    <div className="App" style={{margin: '0 auto', padding: '15px', position: 'relative'}}>
      <input type='text' value={userDate} onChange={(e) => setUserDate(e.currentTarget.value)}/>
      {!visible && <Calendar userDate={userDate} setUserDate={setUserDate}/>}
    </div>
  );
}

export default App;
