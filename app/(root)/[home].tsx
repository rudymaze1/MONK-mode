import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Platform, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Image } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Swipeable } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useFonts } from 'expo-font';
import { customFontsToLoad } from '@/constants/fonts';

// ✅ Only ONE TIME outside
const today = new Date().toISOString().split('T')[0];

const Main = () => {
  const [fontsLoaded] = useFonts(customFontsToLoad);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [completedDates, setCompletedDates] = useState<{ [key: string]: boolean }>({});
  const [tasks, setTasks] = useState<{
    [key: string]: {
      text: string;
      category: 'work' | 'workout' | 'regular';
      completed: boolean;
      notes?: string;
      time?: string; // ✅ ADD THIS LINE
      priority?: 'low' | 'medium' | 'high';
    }[]
  }>({});  const [dotMarkers, setDotMarkers] = useState<{ [key: string]: { key: string; color: string }[] }>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const [taskCategory, setTaskCategory] = useState<'work' | 'workout' | 'regular'>('regular');
  const [taskNotes, setTaskNotes] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const colorMap = { work: '#18563C', workout: '#0D1104', regular: '#184E56' };
  const [taskTime, setTaskTime] = useState('');
  const newTask = {
    text: taskInput,
    category: taskCategory,
    completed: false,
    notes: taskNotes,
    time: taskTime, // ✅ IMPORTANT
    priority,
  };

  useEffect(() => {
    if (fontsLoaded) {
      loadTasks();
      loadCompletedDates();
      loadDotMarkers();
      setSelectedDate(today);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  // ✅ AsyncStorage keys
  const STORAGE_KEY = '@tasks';
  const STORAGE_COMPLETED_KEY = '@completedDates';
  const DOT_MARKERS_KEY = '@dotMarkers';

  const handleGoSettings = () => router.push('/(root)/setting');

  const saveTasks = async (updatedTasks: typeof tasks) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
  };

  const saveCompletedDates = async (updatedCompletedDates: typeof completedDates) => {
    await AsyncStorage.setItem(STORAGE_COMPLETED_KEY, JSON.stringify(updatedCompletedDates));
  };

  const saveDotMarkers = async (updatedMarkers: typeof dotMarkers) => {
    await AsyncStorage.setItem(DOT_MARKERS_KEY, JSON.stringify(updatedMarkers));
  };

  const loadTasks = async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) setTasks(JSON.parse(stored));
  };

  const loadCompletedDates = async () => {
    const stored = await AsyncStorage.getItem(STORAGE_COMPLETED_KEY);
    if (stored) setCompletedDates(JSON.parse(stored));
  };

  const loadDotMarkers = async () => {
    const stored = await AsyncStorage.getItem(DOT_MARKERS_KEY);
    if (stored) setDotMarkers(JSON.parse(stored));
  };

  const updateDotMarkers = (date: string, category: 'work' | 'workout' | 'regular') => {
    const newDot = { key: category, color: colorMap[category] };
    const updated = { ...dotMarkers };

    if (!updated[date]) {
      updated[date] = [newDot];
    } else {
      const filtered = updated[date].filter((dot) => dot.key !== category);
      updated[date] = [...filtered, newDot];
    }

    setDotMarkers(updated);
    saveDotMarkers(updated);
  };

  const sortByPriority = (taskList: typeof tasks[string]) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return [...taskList].sort((a, b) => {
      const priorityComparison = priorityOrder[a.priority || 'medium'] - priorityOrder[b.priority || 'medium'];
      if (priorityComparison !== 0) return priorityComparison;
      return -1; // Newer tasks first if same priority
    });
  };

  const handleAddTask = async () => {
    if (selectedDate && taskInput.trim()) {
      const newTasks = { ...tasks };
      const newTask = {
        text: taskInput,
        category: taskCategory,
        completed: false,
        notes: taskNotes,
        time: taskTime, // ✅ ADD THIS LINE
        priority,
      };
  
      newTasks[selectedDate] = [...(newTasks[selectedDate] || []), newTask];
      newTasks[selectedDate] = sortByPriority(newTasks[selectedDate]);
  
      setTasks(newTasks);
      saveTasks(newTasks);
      updateDotMarkers(selectedDate, taskCategory);
  
      setTaskInput('');
      setTaskNotes('');
      setTaskTime(''); // ✅ reset time
      setTaskCategory('regular');
      setIsModalVisible(false);
    }
  };

  const handleDeleteTask = (date: string, index: number) => {
    const updated = { ...tasks };
    const deleted = updated[date][index];
    updated[date] = updated[date].filter((_, i) => i !== index);

    if (!updated[date].length) delete updated[date];

    setTasks(updated);
    saveTasks(updated);

    const categoryStillExists = updated[date]?.some((t) => t.category === deleted.category);
    if (!categoryStillExists) {
      const newMarkers = { ...dotMarkers };
      newMarkers[date] = newMarkers[date]?.filter((dot) => dot.key !== deleted.category);
      if (!newMarkers[date]?.length) delete newMarkers[date];

      setDotMarkers(newMarkers);
      saveDotMarkers(newMarkers);
    }
  };

  const handleMarkAsCompleted = (date: string, index: number) => {
    const updated = { ...tasks };
    updated[date][index].completed = true;
    updated[date] = sortByPriority(updated[date]);
    setTasks(updated);
    saveTasks(updated);
  };

  const handleEditTask = (date: string, index: number) => {
    const taskToEdit = tasks[date][index];
    setTaskInput(taskToEdit.text);
    setTaskNotes(taskToEdit.notes || '');
    setTaskCategory(taskToEdit.category);
    setPriority(taskToEdit.priority || 'medium');
    setIsModalVisible(true);
  };

  const getDotColor = (category: string) => colorMap[category as keyof typeof colorMap] || '#999';

  const getMarkedDates = () => {
    const marked: { [key: string]: any } = {};

    Object.keys(dotMarkers).forEach((date) => {
      marked[date] = {
        ...(marked[date] || {}),
        dots: dotMarkers[date],
      };
    });

    Object.keys(completedDates).forEach((date) => {
      marked[date] = {
        ...(marked[date] || {}),
        customStyles: {
          ...(marked[date]?.customStyles || {}),
          container: {
            ...(marked[date]?.customStyles?.container || {}),
            backgroundColor: '#4CAF50',
          },
          text: {
            ...(marked[date]?.customStyles?.text || {}),
            color: 'white',
            fontWeight: 'bold',
          },
        },
      };
    });

    if (selectedDate) {
      marked[selectedDate] = {
        ...(marked[selectedDate] || {}),
        selected: true,
        selectedColor: 'lightgrey',
        customStyles: {
          ...(marked[selectedDate]?.customStyles || {}),
          container: {
            ...(marked[selectedDate]?.customStyles?.container || {}),
            borderColor: 'red',
            borderWidth: 2,
            borderRadius: 10,
          },
          text: {
            ...(marked[selectedDate]?.customStyles?.text || {}),
            color: 'white',
            fontWeight: 'bold',
          },
        },
      };
    }

    return marked;
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.settingsButton} onPress={handleGoSettings}>
        <Ionicons name="menu-outline" size={32} color="white" />
      </TouchableOpacity>

      <Image source={require('../../assets/images/longlogo.png')} style={styles.logo} />

      <View style={styles.calendarContainer}>
        <Calendar
          theme={{
            backgroundColor: '#2F2F2A',
            calendarBackground: '#2F2F2A',
            textSectionTitleColor: '#D9D9D9',
            selectedDayBackgroundColor: '#D9D9D9',
            selectedDayTextColor: '#2F2F2A',
            todayTextColor: '#FFD700',
            dayTextColor: '#FFF',
            arrowColor: '#FFD700',
            monthTextColor: '#D9D9D9',
          }}
          onDayPress={(day: { dateString: string }) => setSelectedDate(day.dateString)}
          hideExtraDays
          markedDates={getMarkedDates()}
          markingType="multi-dot"
        />
      </View>

      <ScrollView style={styles.taskSection}>
        {tasks[selectedDate || '']?.map((task, index) => (
          <Swipeable
            key={index}
            renderRightActions={() => (
              <View style={styles.swipeActions}>
                <TouchableOpacity style={styles.completeButton} onPress={() => handleMarkAsCompleted(selectedDate!, index)}>
                  <Ionicons name="checkmark" style={styles.swipeText} size={24} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEditTask(selectedDate!, index)}>
                  <Ionicons name="pencil-outline" style={styles.swipeText} size={24} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteTask(selectedDate!, index)}>
                  <Text style={{ color: 'red', fontWeight: '600' }}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          >
            <View style={[
              styles.taskCard,
              { backgroundColor: task.completed ? '#888' : task.category === 'work' ? '#18563C' : task.category === 'workout' ? '#0D1104' : '#184E56' }
            ]}>
              {task.time ? ( // 👈 ADD THIS
                <Text style={styles.taskTime}>{task.time}</Text>
              ) : null}
              
              <Text style={[styles.taskText, task.completed && { textDecorationLine: 'line-through' }]}>
                {task.text}
              </Text>

              {task.notes ? (
                <Text style={styles.taskNote}>{task.notes}</Text>
              ) : null}
            </View>
          </Swipeable>

        ))}
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <Text style={styles.addTaskText}>+ Add Task</Text>

        </TouchableOpacity>
      </ScrollView>

      <Modal visible={isModalVisible} animationType="slide" transparent onRequestClose={() => setIsModalVisible(false)}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ backgroundColor: '#FFF', margin: '5%', padding: '5%', borderRadius: 20, height:"55%" }}>
            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={{ position: 'absolute', top: 10, right: 10 }}>
              <Ionicons name="close-circle" size={30} color="#999" />
            </TouchableOpacity>
            <TextInput style={{ borderBottomWidth: 1, borderBottomColor: '#999', marginBottom: '5%', padding: 8, fontSize: 16, color: '#333', width:"90%", }} placeholder="Enter task" value={taskInput} onChangeText={setTaskInput} placeholderTextColor="#999" />
            <TextInput style={{ borderBottomWidth: 1, borderBottomColor: '#999', marginBottom: '5%', padding: 8, fontSize: 16, color: '#333' }} placeholder="Notes (optional)" value={taskNotes} onChangeText={setTaskNotes} placeholderTextColor="#999" multiline />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: '5%' }}>
            {['work', 'workout', 'regular'].map((cat) => (
              <TouchableOpacity
      key={cat}
      onPress={() => setTaskCategory(cat as typeof taskCategory)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        backgroundColor: 'grey',
        borderWidth: taskCategory === cat ? 2 : 2,
        borderColor: taskCategory === cat ? 'black' : 'transparent',
      }}
    >
      
      <View
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: getDotColor(cat),
          marginRight: 6,
        }}
        />

              <Text style={{ color: '#FFF', textTransform: 'capitalize' }}>{cat}</Text>
            </TouchableOpacity>
          ))}


        </View>
            <TextInput
              style={{ borderBottomWidth: 1, borderBottomColor: '#999', marginBottom: '5%', padding: 8, fontSize: 16, color: '#333' }}
              placeholder="Time (optional)"
              value={taskTime}
              onChangeText={setTaskTime}
              placeholderTextColor="#999"
            />
            <Picker selectedValue={priority} onValueChange={setPriority} style={{ backgroundColor: 'grey', marginBottom: '5%', borderRadius:30 }}>
              <Picker.Item label="Low" value="low" />
              <Picker.Item label="Medium" value="medium" />
              <Picker.Item label="High" value="high" />
            </Picker>
            <TouchableOpacity style={{ backgroundColor: '#FFD700', padding: '3%', borderRadius: 10, alignItems: 'center' }} onPress={handleAddTask}>
              <Text style={{ color: '#2F2F2A', fontWeight: 'bold', fontSize: 16 }}>Save Task</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2F2F2A' },
  settingsButton: { position: 'absolute', top: '4%', right: '5%', zIndex: 10 },
  logo: { alignSelf: 'center', height: '10%', resizeMode: 'contain', marginVertical: '5%',bottom:"6%", right:"30%" },
  calendarContainer: { paddingHorizontal:0, bottom:"5%", },
  taskSection: { paddingHorizontal: '2%', flex: 1, bottom:"4%" },
  taskCard: { padding: '3%', borderRadius: 8, marginBottom: '2%',},
  taskText: { color: '#FFF', fontSize: 17, fontWeight:"500", fontFamily: 'Poppins-Bold'},
  taskNote: { color: '#DDD', fontSize: 12, marginTop: 4, fontFamily: 'Poppins-light' },
  addTaskText: { textAlign: 'center', color: '#FFD700', fontSize: 16, marginVertical: '5%' },
  swipeActions: { flexDirection: 'row', height:"140%" },
  completeButton: {padding: 10, borderRadius:50, marginRight: 5, height:"60%", marginTop:"5%", marginLeft:5, },
  deleteButton: { padding: 10, borderRadius:50, marginRight: 5, height:"60%", marginTop:"5%", marginLeft:5, },
  editButton: { padding: 10, borderRadius:50, marginRight: 5, height:"60%", marginTop:"5%", marginLeft:5,  },
  swipeText: { color: '#FFF' },
  modalBackground: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalContent: { backgroundColor: '#FFF', margin: '5%', padding: '5%', borderRadius: 20 },
  modalCloseButton: { position: 'absolute', top: 10, right: 10, zIndex: 1 },
  input: { borderBottomWidth: 1, borderBottomColor: '#999', marginBottom: '5%', padding: 8, fontSize: 16, color: '#333' },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: '5%' },
  categoryButton: { padding: 10, borderRadius: 5, backgroundColor: '#444' },
  categoryText: { color: '#FFF' },
  picker: { backgroundColor: '#EEE', marginBottom: '5%' },
  saveButton: { backgroundColor: '#FFD700', padding: '3%', borderRadius: 10, alignItems: 'center' },
  saveButtonText: { color: '#2F2F2A', fontWeight: 'bold', fontSize: 16 },
  taskTime: { color: '#FFD700',fontSize: 14, marginBottom: 4,fontFamily: 'Poppins-Bold',},
});

export default Main;
