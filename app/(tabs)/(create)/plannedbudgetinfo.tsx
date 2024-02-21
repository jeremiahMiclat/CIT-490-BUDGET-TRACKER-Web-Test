import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import DateTimePicker from 'react-native-ui-datepicker';
import { useEffect, useState } from 'react';
import { RootState, counterSlice } from '../../_layout';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import dayjs from 'dayjs';

export default function DebtInfoScreen() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const formData = useSelector((state: RootState) => state.formData);
  const debtInfoData = useSelector((state: RootState) => state.formDebtInfo);
  const dispatch = useDispatch();
  const [formState, setFormState] = useState({});
  const navigation = useNavigation();
  const formIsSubmitted = useSelector(
    (state: RootState) => state.formSubmitted
  );
  const [day, setDay] = useState(dayjs());
  const [OdatePickerIndex, setODatePickerIndex] = useState(null);
  const [OdateValues, setODateValues] = useState<any>([]);

  const showODatePicker = (index: any) => {
    try {
      Keyboard.dismiss();
    } catch (error) {
      console.log(error);
    }
    setODatePickerIndex(prevIndex => {
      if (prevIndex === null || prevIndex !== index) {
        return index;
      } else {
        hideODatePicker();
        return null;
      }
    });
  };

  const hideODatePicker = () => {
    setODatePickerIndex(null);
  };

  const handleODateConfirm = (date: any, index: any) => {
    hideODatePicker();
    setODateValues((prevDateValues: any) => {
      const updatedValues = [...prevDateValues];
      updatedValues[index] = dayjs(date);
      return updatedValues;
    });

    setValue(`plannedBudgetInfo[${index}].startDate`, date);
  };

  const [DdatePickerIndex, setDDatePickerIndex] = useState(null);
  const [DdateValues, setDDateValues] = useState<any>([]);

  const showDDatePicker = (index: any) => {
    try {
      Keyboard.dismiss();
    } catch (error) {
      console.log(error);
    }
    setDDatePickerIndex(prevIndex => {
      if (prevIndex === null || prevIndex !== index) {
        return index;
      } else {
        hideDDatePicker();
        return null;
      }
    });
  };

  const hideDDatePicker = () => {
    setDDatePickerIndex(null);
  };

  const handleDDateConfirm = (date: any, index: any) => {
    hideDDatePicker();
    setDDateValues((prevDateValues: any) => {
      const updatedValues = [...prevDateValues];
      updatedValues[index] = dayjs(date);
      return updatedValues;
    });

    setValue(`plannedBudgetInfo[${index}].endDate`, date);
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        hideDDatePicker();
        hideODatePicker();
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    // Clean up listeners when component unmounts
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const {
    control,
    watch,
    reset,
    getValues,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  let { fields, append, remove } = useFieldArray({
    control,
    name: 'plannedBudgetInfo',
  });
  const watchedFields = watch();
  const onSubmit = (data: any) => {
    dispatch(counterSlice.actions.updateFormData(data));
  };

  const handlePressOnScreen = () => {
    Keyboard.dismiss();
  };

  const removeAll = (index: any) => {
    setODateValues([]);
    setDDateValues([]);
    showDDatePicker(null);
    showODatePicker(null);
  };

  useEffect(() => {}, [formIsSubmitted]);

  useEffect(() => {
    if (isFocused) {
    } else {
      try {
        dispatch(counterSlice.actions.updateDailyBudgetForm(watch()));
        reset({ plannedBudgetInfo: watch().plannedBudgetInfo });
      } catch (error) {
        console.log('useEffect error');
      }
    }

    // Cleanup function (if needed)
    return () => {};
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.flex1}>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={handlePressOnScreen}>
          <View>
            <Pressable
              onPress={() => [
                append({ description: null, amount: null, plannedLogs: [] }),
              ]}
              style={styles.addNewBtn}
            >
              <Text style={styles.addNewBtnText}>Add</Text>
            </Pressable>
          </View>
        </TouchableWithoutFeedback>
        <ScrollView style={styles.sv} keyboardShouldPersistTaps="handled">
          <View style={styles.flex1}>
            {fields.map((field, index) => (
              <View key={field.id} style={styles.itemsContainer}>
                <View style={styles.items}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        placeholder="Description"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                    name={`plannedBudgetInfo[${index}].description`}
                  />
                </View>

                <View style={styles.items}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        placeholder="Amount"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        keyboardType={'number-pad'}
                      />
                    )}
                    name={`plannedBudgetInfo[${index}].amount`}
                  />
                </View>

                <View style={styles.items}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <>
                        <Pressable onPress={() => showODatePicker(index)}>
                          <TextInput
                            value={
                              OdateValues[index] != undefined
                                ? 'Start Date: ' +
                                  OdateValues[index].format('MMMM DD, YYYY')
                                : 'Set Start Date'
                            }
                            editable={false}
                            style={styles.dateInput}
                          />
                        </Pressable>
                      </>
                    )}
                    name={`plannedBudgetInfo[${index}].startDate`}
                  />
                </View>

                {OdatePickerIndex === index && (
                  <DateTimePicker
                    mode="date"
                    onValueChange={date => handleODateConfirm(date, index)}
                    value={OdateValues[index] || day}
                  />
                )}

                <View style={styles.items}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <>
                        <Pressable onPress={() => showDDatePicker(index)}>
                          <TextInput
                            value={
                              DdateValues[index] != undefined
                                ? 'End Date: ' +
                                  DdateValues[index].format('MMMM DD, YYYY')
                                : 'Set End Date'
                            }
                            editable={false}
                            style={styles.dateInput}
                          />
                        </Pressable>
                      </>
                    )}
                    name={`plannedBudgetInfo[${index}].endDate`}
                  />
                </View>

                {DdatePickerIndex === index && (
                  <DateTimePicker
                    mode="date"
                    onValueChange={date => handleDDateConfirm(date, index)}
                    value={DdateValues[index] || day}
                  />
                )}

                <Pressable
                  onPress={() => [remove(index), removeAll(index)]}
                  style={styles.fieldRBtn}
                >
                  <Text style={styles.RBtnText}>Remove</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  addNewBtn: {
    backgroundColor: 'blue',
    padding: 20,
    alignSelf: 'center',
    borderRadius: 10,
  },

  addNewBtnText: {
    color: 'white',
  },
  fields: {
    margin: 20,
  },
  fieldInput: {
    padding: 10,
    margin: 10,
    borderColor: 'blue',
    borderWidth: 1,
    borderRadius: 10,
  },
  fieldRBtn: {
    backgroundColor: 'red',
    padding: 10,
    alignSelf: 'center',
    borderRadius: 10,
  },
  RBtnText: {
    color: 'white',
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  sv: {
    flex: 1,
  },
  errors: {
    backgroundColor: 'red',
  },
  hidden: {
    display: 'none',
  },
  itemsContainer: {
    flex: 1,
    borderColor: 'blue',
    borderWidth: 1,
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  items: {
    padding: 10,
    borderColor: 'blue',
    borderWidth: 0.5,
    borderRadius: 10,
    margin: 10,
  },
  dateInput: {
    color: 'black',
  },
});
