import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Theme from "../../Config/Theme";

const fontFamily =
  Platform.OS === "android" ? "COM4F_RG" : "COM4t Fine Regular";

const Button = ({ onPress, title, width, height, theme, style, textStyle }) => {
  const { GradientColors } = Theme(theme);
  console.log("By Gradient", theme);
  return (
    <View
      style={[
        {
          width,
          height,
          backgroundColor: "#fff",
          borderRadius: width && width / 2,
        },
        style,
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPress && onPress()}
        style={styles.buttonStyle}
      >
        <LinearGradient
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          colors={GradientColors}
          style={[styles.linearGradient, { borderRadius: width / 2 }]}
        />
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontFamily,
    color: "#fff",
  },
  linearGradient: {
    flex: 1,
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    opacity: 0.7,
    resizeMode: "cover",
    alignSelf: "center",
  },
});
export default Button;
