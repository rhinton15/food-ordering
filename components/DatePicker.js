import React, { useState } from "react";
import { Button, Text, SafeAreaView, Pressable } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

function DatePicker({ date, setDate }) {
  //   const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => setDate(selectedDate);
  //   const handleOnPress = () => setShow(true);

  return (
    <>
      {/* <Pressable onPress={handleOnPress}>
        <Text>Show Spinner</Text>
      </Pressable>
      {show && (
          )} */}
      <DateTimePicker
        testID="dateTimePicker"
        value={date}
        mode="date"
        onChange={onChange}
        //   display="spinner"
        //   style={{ width: "100%" }}
      />
    </>
  );

  //   const [open, setOpen] = useState(false);

  //   return (
  //     <>
  //       <Button title="Open" onPress={() => setOpen(true)} />
  //       <RNDatePicker
  //         modal
  //         open={open}
  //         date={date}
  //         onConfirm={(date) => {
  //           setOpen(false);
  //           setDate(date);
  //         }}
  //         onCancel={() => {
  //           setOpen(false);
  //         }}
  //       />
  //     </>
  //   );
}

export default DatePicker;
