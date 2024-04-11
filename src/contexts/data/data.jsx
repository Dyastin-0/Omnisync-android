import React, { createContext, useContext, useEffect, useState } from 'react';

import { onValue, ref, query, orderByChild, startAfter, endAt } from 'firebase/database';

import { db } from '../../config/firebase';
import { pushInArray, setQuery } from '../../config/database';
import { formatTime } from '../../utils/time';
import { useAuth } from '../auth/auth';

import { TogglePanelItem } from '../../components/toggle-panel/toggle-panel-item';
import { MessagePanelItem } from '../../components/message-panel/message-panel-item';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ( {children} ) => {
  const [isFetching, setIsFetching] = useState(true);
  const [toggles, setToggles] = useState(null);
  const [renderedToggles, setRenderedToggles ] = useState([]);
  const [messages, setMessages] = useState(null);
  const [renderedMessages, setRenderedMessages] = useState([]);
  const { user, userDataPath } = useAuth();


  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setToggles([]);
      setMessages([]);
    }
  }, [user]);

  useEffect(() => {
    if ((toggles !== null) && (messages !== null)) setIsFetching(false);
  }, [toggles, messages]);

  const fetchData = async () => {
    const togglesRef = ref(db, `/${userDataPath}/toggles`);
    onValue(togglesRef, (snapshot) => {
      setToggles(snapshot.val() || []);
    });

    const currentUnixTimestamp = Math.floor(Date.now() / 1000);
    const sevenDaysAgoUnixTimestamp = currentUnixTimestamp - (7 * 24 * 60 * 60);
    const messagesRef = ref(db, `/${userDataPath}/messages`);
    const queryRef = query(
      messagesRef,
      orderByChild('timeSent'),
      startAfter(sevenDaysAgoUnixTimestamp)
    );
  
    onValue(queryRef, (snapshot) => {
      setMessages(snapshot.val() || []);
    });
  };

  const renderToggles = () => {
    const rendered = Object.entries(toggles).map(([key, value], index) => (
      <TogglePanelItem
        className="sub-container"
        sentBy={`${user.displayName}`}
        key={key}
        index={key}
        toggleName={value.name}
        checked={value.state}
        path={`/${userDataPath}/toggles/${index}/state`}
      />
    ));
    setRenderedToggles(rendered);
  };

  const setToggleState = (name, state, message) => {
    setQuery(`/${userDataPath}/toggles`, 'name', name, state);
    pushInArray(`/${userDataPath}/messages`, message);
  }

  const addToggle = async (toggleName) => {
    await pushInArray(`/${userDataPath}/toggles`, {
      name: toggleName,
      state: 0
    });
    await pushInArray(`/${userDataPath}/messages`, {
      sentBy: user.displayName,
      message: `Added a toggle named ${toggleName.toLowerCase()}.`,
      timeSent: new Date().getTime()
    });
  }

  useEffect(() => {
    toggles && renderToggles();
  }, [toggles]);

  const renderMessages = () => {
    const rendered = Object.entries(messages).map(([key, value]) => (
      <MessagePanelItem
        isMessageOwner={user.displayName === value.sentBy} 
        key={key}
        message={value.message}
        timeSent={formatTime(value.timeSent)}
        sentBy={value.sentBy}
      /> 
    ));
    setRenderedMessages(rendered);
  }

  useEffect(() => {
    messages && renderMessages();
  }, [messages]);

  const value = {
    toggles,
    messages,
    renderedToggles,
    setToggleState,
    addToggle,
    renderedMessages,
    isFetching
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};