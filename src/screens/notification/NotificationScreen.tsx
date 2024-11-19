import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { eventEmitter } from '../../../index.js';
import notificationAPI from '../../apis/notificationApi';
import { SectionComponent } from '../../components';
import NotificationItem from '../../components/NotificationItem';
import { NotificationModel } from '../../model/notification_model';
import { authSelector } from '../../redux/reducers/authReducer';
const NotificationScreen = ({navigation} : any) => {
  const [listNoti, setListNoti] = useState<NotificationModel[]>();
  
  const user = useSelector(authSelector);

  const getListNotification = async () => {
    const apiNoti = `/get-alls?userId=${user?.id}`;

    try {
      const res = await notificationAPI.HandleNotification
      (
        apiNoti,
      );
    setListNoti(() => res.data)

    } catch (error) {
      console.log(error);
      
    }
  }

  useEffect(() => {
    getListNotification();
    // Lắng nghe sự kiện 'newNotification'
    const subscription = eventEmitter.on('newNotification', getListNotification);

    // Hủy lắng nghe sự kiện khi component unmount
    return () => {
      subscription.off('newNotification', getListNotification);
    };
  }, [])

  return (
    <FlatList
      data={listNoti}
      keyExtractor={(item: any) => item?._id.toString()}
      renderItem={({ item }) => (
        <SectionComponent>
          <NotificationItem
            title={item?.title}
            message={item?.body}
            onUpdateList={getListNotification}
            idItem={item?._id.toString()}
            userId={user?.id}
            notiStatus={item?.status}
            createdAt={item?.createdAt}
            onPress={() =>  navigation.navigate('DetailNotificationScreen', {
              item : item
            }) }
          />
        </SectionComponent>
      )}
    />
  )
}

export default NotificationScreen;