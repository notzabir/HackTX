import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import db from "../../firebaseConfig";

export default function ScheduleScreen() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "schedules"));
        const coursesArray = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCourses(coursesArray);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        My Schedule
      </Text>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 15, padding: 10, borderWidth: 1, borderRadius: 8 }}>
            <Text>Course: {item.courseName}</Text>
            <Text>Professor: {item.professorName}</Text>
            <Text>
              Timing: {item.Timing.days} {item.Timing.timing}
            </Text>
            <Text>Building: {item.buildingName}</Text>
          </View>
        )}
      />
    </View>
  );
}
