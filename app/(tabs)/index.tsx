import { client, DATABASE_ID, databases, HABITS_COLLECTION_ID, RealtimeResponse } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habit } from "@/types/database.type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Query } from "react-native-appwrite";
import { Swipeable } from "react-native-gesture-handler";
import { Button, Surface, Text } from "react-native-paper";

export default function Index() {
  const { signOut, user } = useAuth();

  const [habits, setHabits] = useState<Habit[]>();

  const swipeableRefs = useRef<{ [key: string]: Swipeable | null}>({});

  useEffect(() => {
    if (user) {
      const channel = `databases.${DATABASE_ID}.collections.${HABITS_COLLECTION_ID}.documents`

      const habitsSubscription = client.subscribe(
        channel,
        (response: RealtimeResponse) => {
          // 3 cases: create habit (fetch), update streaks, delete habit from screen
          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.create"
            )
          ) {
            fetchHabits();
          } else if (
            response.events.includes(
              "databases.*.collections.*.documents.*.update"
            )
          ) {
            fetchHabits();
          } else if (
            response.events.includes(
              "databases.*.collections.*.documents.*.delete"
            )
          ) {
            fetchHabits();
          }
        }
      );
      fetchHabits();

      return() => {
        habitsSubscription();
      };
    }
  }, [user]);

  const fetchHabits = async () => {
    try{
      const response = await databases.listDocuments(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? "")]
      );
      console.log(response.documents);
      setHabits(response.documents as Habit[]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant='headlineSmall' style={styles.title}> { "Today's Habits" }</Text>
        <Button mode='text' onPress={signOut} icon={"logout"}>
          Sign out
        </Button>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}> 
        {habits?.length ===0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}> No Habits yet. Add your first Habit!</Text>
          </View>
        ) : (
          habits?.map((habit, key) => (
            <Swipeable 
              ref={(ref) => {
                swipeableRefs.current[habit.$id] = ref;
              }}
              key={key} 
              overshootLeft={false}
              overshootRight={false}
            >
              <Surface  style= {styles.card} elevation={0}>
                <View style={styles.cardContent}> 
                  <Text style={styles.cardTitle}>  {habit.title} </Text>
                  <Text style={styles.cardDescription}>  {habit.description} </Text>
                  <View style={styles.cardFooter}>
                    <View style={styles.streakBadge}>
                      <MaterialCommunityIcons
                        name = "fire"
                        size = {18}
                        color={"#ff9800"}
                      />
                      <Text style={styles.streakText}>{habit.streak_count} day streak </Text>
                    </View>
                    <View style={styles.frequencyBadge}>
                      <Text style={styles.frequencyText}>
                        {habit.frequency.charAt(0).toUpperCase() +
                          habit.frequency.slice(1)} </Text>
                    </View>
                  </View>
                </View>
              </Surface>
            </Swipeable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },

  header: {
    flexDirection: "row", 
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  }, 

  title:{
    fontWeight: "bold",
    color: "#000000"
  },

  card: {
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: "#f7f2fa",
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  cardContent: {
    padding: 20,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#22223b"
  },

  cardDescription: {
    fontSize: 15,
    marginBottom: 16,
    color: "#6c6c80",
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3e0",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  streakText: {
    marginLeft: 6,
    color: "#ff9800",
    fontWeight: "bold",
    fontSize: 14,
  },

  frequencyBadge: {
    backgroundColor: "#ede7f6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },

  frequencyText: {
    color: "#7c4dff",
    fontWeight: "bold",
    fontSize: 14,
  },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyStateText: {
    color: "#666666",
  },
});
