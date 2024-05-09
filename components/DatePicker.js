import React, { useState } from "react";
import { Button, Text, SafeAreaView, Pressable } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

function DatePicker({ date, setDate }) {
  const onChange = (event, selectedDate) => setDate(selectedDate);

  return (
    <>
      <DateTimePicker
        testID="dateTimePicker"
        value={date}
        mode="date"
        onChange={onChange}
      />
    </>
  );
}

export default DatePicker;
