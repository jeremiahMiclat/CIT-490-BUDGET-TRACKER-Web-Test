import {
  FlatList,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, counterSlice } from '../_layout';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function DailyLogsSpent() {
  const dispatch = useDispatch();
  const dataList = useSelector((state: RootState) => state.data.value);
  const itemOnView = useSelector((state: RootState) => state.viewing);
  const data = useSelector((state: RootState) => state.data);
  const dataValue = data.value;
  const dailyLogs = (itemOnView as any).dailyLogs;
  const spentLogs = dailyLogs.spent;

  const renderLogs = (item: any) => {
    return (
      <View style={styles.listItemContainer}>
        <Text style={styles.listItem}>
          Description: {item?.item?.description}
        </Text>

        <Text style={styles.listItem}>Amount: {item?.item?.amount}</Text>

        <Text style={styles.listItem}>Date: {item?.item?.date}</Text>
        <Pressable
          style={styles.delIcon}
          onPress={(event: GestureResponderEvent) => handleDelLog(item)}
        >
          <MaterialIcons name="delete" size={24} color="black" />
        </Pressable>
      </View>
    );
  };

  const handleDelLog = (item: any) => {
    const currSpentLogs = (itemOnView as any).dailyLogs.spent;
    const currReceivedLogs = (itemOnView as any).dailyLogs.received;
    const newLogs = [...(itemOnView as any).dailyLogs.spent];
    newLogs.splice(item.index, 1);
    const currItemOnView = itemOnView;
    const newOnView = {
      ...currItemOnView,
      dailyLogs: { spent: [...newLogs], received: [...currReceivedLogs] },
    };
    dispatch(
      counterSlice.actions.updateViewing({
        ...newOnView,
      })
    );
    const onViewIndex = (dataValue as []).findIndex(
      (obj: any) => obj.dateAdded == (newOnView as any).dateAdded
    );
    let prevDataValues = [...dataValue];

    (prevDataValues as any)[onViewIndex] = newOnView;
    dispatch(
      counterSlice.actions.updateData({
        identifier: data.identifier,
        value: prevDataValues,
      })
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <FlatList
          data={spentLogs}
          renderItem={renderLogs}
          keyExtractor={(item: any, index: any) => index}
        />
      </View>

      <Link href={'/addspent'} style={styles.addBtn} asChild>
        <Pressable>
          <Ionicons name="add-circle-sharp" size={50} color="black" />
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addBtn: {
    alignSelf: 'center',
    padding: 30,
  },
  listItem: {
    borderColor: 'blue',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  listItemContainer: {
    borderColor: 'blue',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  delIcon: {
    alignSelf: 'center',
    margin: 10,
  },
});
