import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  Button,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Swipeable } from 'react-native-gesture-handler';
import {
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';



const Main = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [completedDates, setCompletedDates] = useState<{ [key: string]: boolean }>({});
  const [tasks, setTasks] = useState<{ [key: string]: { text: string; category: 'work' | 'workout' | 'regular'; completed: boolean }[] }>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const [taskCategory, setTaskCategory] = useState<'work' | 'workout' | 'regular'>('regular');
  const [dotMarkers, setDotMarkers] = useState<{ [key: string]: { key: string; color: string }[] }>({});
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  const today = new Date().toISOString().split('T')[0];
  const [taskNotes, setTaskNotes] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  





  useEffect(() => {
    loadTasks();
    loadCompletedDates();
    loadDotMarkers();
    setSelectedDate(today); // ✅ Select today's date on first load
  }, []);


  const STORAGE_KEY = '@tasks';
  const STORAGE_COMPLETED_KEY = '@completedDates';
  const DOT_MARKERS_KEY = '@dotMarkers';

  



const saveDotMarkers = async (updatedMarkers: { [key: string]: { key: string; color: string }[] }) => {
  try {
    await AsyncStorage.setItem(DOT_MARKERS_KEY, JSON.stringify(updatedMarkers));
  } catch (error) {
    console.error('Failed to save dot markers:', error);
  }
};



  const loadCompletedDates = async () => {
    try {
      const storedCompletedDates = await AsyncStorage.getItem(STORAGE_COMPLETED_KEY);
      if (storedCompletedDates) {
        setCompletedDates(JSON.parse(storedCompletedDates));
      }
    } catch (error) {
      console.error('Failed to load completed dates:', error);
    }
  };

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const saveTasks = async (updatedTasks: { [key: string]: { text: string; category: 'work' | 'workout' | 'regular'; completed: boolean }[] }) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  };

  const saveCompletedDates = async (updatedCompletedDates: { [key: string]: boolean }) => {
    try {
      await AsyncStorage.setItem(STORAGE_COMPLETED_KEY, JSON.stringify(updatedCompletedDates));
    } catch (error) {
      console.error('Failed to save completed dates:', error);
    }
  };

  const handleDeleteTask = (date: string, index: number) => {
    setTasks((prevTasks) => {
      const newTasks = { ...prevTasks };
      const deletedTask = newTasks[date][index]; // Get the task to delete
      newTasks[date] = newTasks[date].filter((_, i) => i !== index); // Remove the task
  
      // Clean up dot marker if no more tasks of that category exist for this date
      const remainingTasks = newTasks[date] || [];
      const categoryStillExists = remainingTasks.some(t => t.category === deletedTask.category);
  
      if (!categoryStillExists) {
        setDotMarkers((prevMarkers) => {
          const updatedMarkers = { ...prevMarkers };
          if (updatedMarkers[date]) {
            updatedMarkers[date] = updatedMarkers[date].filter(dot => dot.key !== deletedTask.category);
            if (updatedMarkers[date].length === 0) {
              delete updatedMarkers[date]; // Remove date completely if no dots left
            }
          }
  
          saveDotMarkers(updatedMarkers); // ✅ Save updated markers to AsyncStorage here
          return updatedMarkers;
        });
      }
  
      // If no tasks at all remain for this date, delete the date key
      if (newTasks[date].length === 0) {
        delete newTasks[date];
      }
  
      saveTasks(newTasks);
      return newTasks;
    });
  };
  
  

  const handleMarkAsCompleted = (date: string, index: number) => {
    setTasks((prevTasks) => {
      const newTasks = { ...prevTasks };
      newTasks[date][index].completed = true; // Mark task as completed
      saveTasks(newTasks);
      return newTasks;
    });
  };

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  const updateDotMarkers = (date: string, category: 'work' | 'workout' | 'regular') => {   // ------------change color of dot
    const colorMap = {
      work: 'yellow',
      workout: '#0D1104',
      regular: '#18563C',
    };
  
    setDotMarkers((prev) => {
      const updated = { ...prev };
      const newMarker = { key: category, color: colorMap[category] };
  
      if (!updated[date]) {
        updated[date] = [newMarker];
      } else {
        const existing = updated[date].filter((m) => m.key !== category);
        updated[date] = [...existing, newMarker];
      }
  
      saveDotMarkers(updated); // Save here
      return updated;
    });
  };

  const loadDotMarkers = async () => {
    try {
      const storedMarkers = await AsyncStorage.getItem(DOT_MARKERS_KEY);
      if (storedMarkers) {
        setDotMarkers(JSON.parse(storedMarkers));
      }
    } catch (error) {
      console.error('Failed to load dot markers:', error);
    }
  };
  

  const handleAddTask = async () => {
    if (selectedDate && taskInput.trim() !== '') {
      setTasks((prevTasks) => {
        const newTasks = { ...prevTasks };
        newTasks[selectedDate] = [
          ...(newTasks[selectedDate] || []),
          { text: taskInput, category: taskCategory, completed: false },
        ];
        saveTasks(newTasks);
        return newTasks;
      });

      updateDotMarkers(selectedDate, taskCategory);
      setTaskInput('');
      setTaskCategory('regular');
      setIsModalVisible(false);
    }
  };

  const getMarkedDates = () => {
    const marked: any = {};

    if (selectedDate) {
      marked[selectedDate] = {
        selected: true,
        selectedColor: 'lightgrey',
        customStyles: {
          container: {
            borderWidth: 1,
            borderColor: 'white',
            borderRadius: 10,
          },
          text: {
            color: 'white',
            fontWeight: 'bold',
          },
        },
      };
    }

    Object.keys(completedDates).forEach((date) => {
      marked[date] = {
        ...(marked[date] || {}),
        customStyles: {
          container: {
            backgroundColor: '#4CAF50',
          },
          text: {
            color: 'white',
            fontWeight: 'bold',
          },
        },
      };
    });

    Object.keys(dotMarkers).forEach((date) => {
      marked[date] = {
        ...(marked[date] || {}),
        dots: dotMarkers[date],
      };
    });

    return marked;
  };

  return (
    <SafeAreaView style={styles.container}>
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
          onDayPress={handleDayPress}
          hideExtraDays={true}
          markedDates={getMarkedDates()}
          markingType="multi-dot"
        />
      </View>

      <View style={styles.marktplace}>
        {selectedDate && (
          <View style={styles.completedInfo}>
            <ScrollView style={styles.taskSection} showsVerticalScrollIndicator={false}>
              <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                <Text style={styles.addTaskText}>Add Task</Text>
              </TouchableOpacity>
              <View style={styles.taskCards}>
                {tasks[selectedDate]?.map((task, index) => (
                  <Swipeable
                    key={index}
                    renderRightActions={() => (
                      <View style={styles.swipeActions}>
                        <TouchableOpacity
                          style={styles.markAsCompleteButton}
                          onPress={() => handleMarkAsCompleted(selectedDate, index)}
                        >
                          <Text style={styles.swipeButtonText}>Mark as Complete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDeleteTask(selectedDate, index)}
                        >
                          <Text style={styles.swipeButtonText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  >
                    <View
                      style={[
                        styles.taskCard,
                        { backgroundColor: task.completed ? '#888' : task.category === 'work' ? 'yellow' : task.category === 'workout' ? '#0D1104' : '#184E56' }, // -------------to change color of card. 
                      ]}
                    >
                      <Text style={[styles.taskText, { textDecorationLine: task.completed ? 'line-through' : 'none' }]}>{task.text}</Text>
                    </View>
                  </Swipeable>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContainer}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={[styles.modalContent, { flex: 1 }]}
            >
              <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} style={{position:"fixed"}}>
                <Ionicons name='close-circle' size={40} style={{left:"90%",}} />
              </TouchableOpacity>

                <Text style={styles.addtitle}>Add Event</Text>
                {/* Category Dot Preview */}
                <View style={{ alignItems: 'center', marginBottom: 10 }}>
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor:
                        taskCategory === 'work' ? 'yellow' :
                        taskCategory === 'workout' ? 'black' :
                        '#5C5C5C',
                    }}
                  />
                </View>

                {/* Task Input */}
                <TextInput
                  style={styles.input}
                  placeholder="Enter your task"
                  value={taskInput}
                  onChangeText={setTaskInput}
                  placeholderTextColor="#999"
                  multiline
                  textAlignVertical="top"
                />

                {/* Category Selection */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                  {['work', 'workout', 'regular'].map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={{
                        padding: 10,
                        borderRadius: 5,
                        backgroundColor: taskCategory === cat ? (
                          cat === 'work' ? 'yellow' : cat === 'workout' ? 'black' : '#5C5C5C'
                        ) : '#444',
                      }}
                      onPress={() => setTaskCategory(cat as 'work' | 'workout' | 'regular')}
                    >
                      <Text style={{ color: 'white', textTransform: 'capitalize' }}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Notes */}
                <TextInput
                  style={[styles.input, { height: 60 }]}
                  placeholder="Optional Notes"
                  value={taskNotes}
                  onChangeText={setTaskNotes}
                  placeholderTextColor="#999"
                  multiline
                />

                {/* Priority Picker */}
                <View style={{ marginVertical: 10 }}>
                  <Text style={{ color: '#444' }}>Priority:</Text>
                  <Picker
                    selectedValue={priority}
                    onValueChange={(itemValue) => setPriority(itemValue)}
                    style={{ backgroundColor: '#444', borderRadius: 30, width:"40%" }}
                  >
                    <Picker.Item label="Low" value="low" color='white' />
                    <Picker.Item label="Medium" value="medium" color='white'/>
                    <Picker.Item label="High" value="high" color='white'/>
                  </Picker>
                </View>

                <TouchableOpacity onPress={handleAddTask}>
                <Text style={styles.taskadd}>Add Task</Text>
              </TouchableOpacity>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2F2F2A',
  },
  logo: {
    height: 100,
    width: 200,
    bottom: 55,
    resizeMode: 'contain',
  },
  calendarContainer: {
    right: 5,
    backgroundColor: '#2F2F2A',
    borderRadius: 10,
    width: '100%',
    bottom: 30,
  },
  marktplace: {
    bottom: 30,
  },
  completedInfo: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2F2F2A',
    borderRadius: 8,
  },
  completedText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 10,
    height: 20,
  },
  taskSection: {
    marginTop: 20,
    height: '70%',

  },
  addTaskText: {
    color: '#FFD700',
    fontSize: 18,
    textAlign: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 8,
  },
  taskCards: {
    marginTop: 10,
    marginBottom: 40,
  },
  taskCard: {
    backgroundColor: '#333',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    height:60,
  },
  taskText: {
    color: '#D9D9D9',
  },
  taskadd:{
    color: 'white',
    backgroundColor:"#444",
    fontSize: 18,
    textAlign: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    top:"30%",
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    width:"100%",
    height:"50%",
  },
  addtitle: {
    position:"absolute",
    fontSize: 20,
    fontWeight: "600",
    paddingBottom:10,
    left:"37%",

  },  
  input: {
    backgroundColor: 'white',
    color: '#444',
    padding: 10,
    marginBottom: 10,
    borderRadius: 15, 
    borderWidth: 1,
    borderColor: "#444",
    height: 50, // 👈 Optional: make this more standard height
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D9D9D9',
    borderRadius: 4,
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkmark: {
    position: 'absolute',
  },
  checkboxText: {
    color: '#D9D9D9',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 5,
    marginVertical: 2,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
  completeBtn: {
    marginTop: 8,
    backgroundColor: '#333',
    padding: 5,
    borderRadius: 4,
    alignItems: 'center',
  },
  completeBtnText: {
    color: '#fff',
    fontSize: 12,
  },
  swipeActions: {
    flexDirection: 'row',
    backgroundColor: '#dcdcdc',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    width: 120,
  },
  markAsCompleteButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },

  swipeButtonText: {
    color: 'white',
    fontSize: 14,
  },
});


