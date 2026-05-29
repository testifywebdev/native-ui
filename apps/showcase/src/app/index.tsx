import { THEME } from "@/lib/theme";
import useStyles from "@/lib/use-styles";
import { Link } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  const styles = useStyles((theme) => ({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: THEME[theme].colors.background,
    }
}));
  return (
    <View style={styles.container}>
     <Link href="/components/dialog" style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 18, color: "#007AFF" }}>Accordion</Text>
      </Link>
      <Link href="/components/alert-dialog" style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 18, color: "#007AFF" }}>Alert Dialog</Text>
      </Link>
      <Link href="/components/carousel" style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 18, color: "#007AFF" }}>Carousel</Text>
      </Link>
      <Link href="/components/radio-group" style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 18, color: "#007AFF" }}>Checkbox</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
