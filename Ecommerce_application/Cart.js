import React, { Component } from "react";
import { connect } from "react-redux";
import MyBody from "../../Components/Header/Header";
import {
  View,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  Dimensions,
} from "react-native";
import Path from "../../Config/Path";
import { Card, Input } from "native-base";
import styles from "./Styles";
import LinearGradient from "react-native-linear-gradient";
import Theme from "../../Config/Theme";
import Modal from "react-native-modal";
import Counter from "../../Components/Counter/Counter";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome5";
import PromoInput from "./PromoInput/PromoInput";
import Checkout from "../Checkout/Checkout";
import GMiddleware from "../../Store/Middlewares/GeneralMiddleware";
import { store } from "../../Store/Store";
import Text from "../../Components/Text/Text";
import { getTextToTranslate } from "../../MultiLanguage/getTextToTranslate";

const { height } = Dimensions.get("window");

let modalPopTop = height / 2;
class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAddPromo: false,
      isCheckout: false,
      isPromoError: false,
      totalPrice: "",
      validPromoCodes: [
        {
          _id: 12,
          promo: "Promo",
        },
        {
          _id: 25,
          promo: "Oooh",
        },
      ],
      itemQty: 0,
      promoInputCount: 0,
      qtyCount: 1,
      isDelete: false,
      currentItem: null,
      items: [],
      promoCodes: [],
      promoInput: [],
      validCodeList: [],
    };
  }

  componentDidMount = () => {
    const { GeneralMiddleware } = this.props;
    const { items } = this.state;
    this.calculateTotalPrice();
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );
    console.log("PATH", Path);
    GeneralMiddleware({
      URL: "/api/cart/",
      METHOD: "GET",
      BODY: null,
      CONFIG: "",
      FIELD: "PROFILE_GET",
      SECURE: true,
    }).then((res) => {
      this.setState({ items: res.products });
      console.log("RESPONSE", res.products);
    });
  };

  componenctWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow() {
    modalPopTop = 0;
  }

  _keyboardDidHide() {
    modalPopTop = height / 2;
  }

  // QTY INCREMENT
  handleQtyIncrement = (item) => {
    const items = [...this.state.items];
    const index = items.indexOf(item);
    items[index] = { ...items[index] };
    items[index].productquantity = items[index].productquantity + 1;
    this.setState({ items });
  };

  handleQtyDecrement = (item) => {
    const items = [...this.state.items];
    const index = items.indexOf(item);
    items[index] = { ...items[index] };
    items[index].productquantity =
      items[index].productquantity > 0 ? items[index].productquantity - 1 : 0;

    this.setState({ items });
  };
  //END

  handleItemRemove = (item) => {
    const items = this.state.items.filter((i) => i.id !== item.id);
    this.setState({ items, isDelete: !this.state.isDelete, currentItem: null });
  };

  generateKey = (pre) => {
    const uniqueTime = new Date().getTime();
    return pre + "_" + uniqueTime;
  };

  calculateTotalPrice = () => {
    const { items } = this.state;

    return items.reduce(
      (prev, curr) => prev + curr["productprice"] * curr["productquantity"],
      0
    );
  };

  // PROMO CODE SECTION START
  addPromoInput = (index) => {
    let { promoInput } = this.state;
    if (promoInput.length < 2) {
      promoInput.push(
        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={styles.promoInput}
            onChangeText={(text) => this.addCodeData(text, index)}
          />
          <TouchableOpacity
            onPress={() => this.removePromoInput()}
            style={styles.submitPromoBtn}
          >
            <Text style={styles.saleTxtClr}>-</Text>
          </TouchableOpacity>
        </View>
      );
    }
    this.setState({ promoInput });
  };

  removePromoInput = () => {
    let { promoInput } = this.state;
    let { promoCodes } = this.state;
    promoInput.pop();
    promoCodes.pop();
    this.setState({ promoInput, promoCodes });
  };

  addCodeData = (text, index) => {
    let dataArray = this.state.promoCodes;
    let checkBool = false;
    if (dataArray.length !== 0) {
      dataArray.forEach((element) => {
        if (element.index === index) {
          element.text = text;
          checkBool = true;
        }
      });
    }
    if (checkBool) {
      this.setState({
        promoCodes: dataArray,
      });
    } else {
      dataArray.push({ text: text, index: index });
      this.setState({
        promoCodes: dataArray,
      });
    }
  };

  handleCheckout = () => {
    const { isCheckout } = this.state;
    return (
      <Modal
        isVisible={isCheckout}
        backdropColor="white"
        onBackdropPress={() => this.setState({ isCheckout: false })}
        animationOut="slideOutDown"
        animationIn="slideInUp"
        animationInTiming={500}
        animationOutTiming={500}
        style={[styles.promoModal, { marginTop: modalPopTop - 60 }]}
      >
        <View style={styles.closeBtnContainer}>
          <TouchableOpacity
            style={styles.closePromoModal}
            onPress={() => {
              this.setState({ isCheckout: false });
            }}
          >
            <Text>V</Text>
          </TouchableOpacity>
        </View>
        <Checkout price={this.calculateTotalPrice()} />
      </Modal>
    );
  };

  handlePromos = () => {
    const { isAddPromo, promoCodes } = this.state;
    return (
      <Modal
        isVisible={isAddPromo}
        backdropColor="white"
        onBackdropPress={() => this.setState({ isAddPromo: false })}
        animationOut="slideOutDown"
        animationIn="slideInUp"
        animationInTiming={500}
        animationOutTiming={500}
        style={[styles.promoModal, { marginTop: modalPopTop }]}
      >
        <View style={styles.closeBtnContainer}>
          <TouchableOpacity
            style={styles.closePromoModal}
            onPress={() => {
              this.setState({ isAddPromo: false });
            }}
          >
            <Text>V</Text>
            {/* <FontAwesomeIcon style={styles.delIconBtn} name="arrow" /> */}
          </TouchableOpacity>
        </View>
        <View
          style={{
            alignItems: "center",
          }}
        >
          {this.state.isPromoError ? (
            <Text style={styles.promoError}>
              Oops, guess the promo code is not correct
            </Text>
          ) : (
            <></>
          )}
          {promoCodes ? (
            <View style={{ flexDirection: "row" }}>
              {promoCodes.map((p) => (
                <View style={{ flexDirection: "row" }}>
                  {console.log("opopop", this.state.validCodeList)}
                  <Text style={{ paddingLeft: 10, fontSize: 18 }}>
                    #{p.text}
                  </Text>
                  <Text
                    style={{ paddingLeft: 5, fontSize: 20 }}
                    onPress={() => this.removePromoInput()}
                  >
                    x
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <></>
          )}
        </View>
        <View style={styles.modalContent}>
          <Text style={styles.promoTxt}>Have promotion code? </Text>
          <Text style={styles.promoTxt}>
            Please add it below then we will deduct the price
          </Text>
          <ScrollView
            ref={(el) => {
              this.scroll = el;
            }}
            style={{ flexDirection: "row" }}
          >
            <PromoInput
              promoInput={this.state.promoInput}
              onAddInput={() =>
                this.addPromoInput(this.state.promoCodes.length)
              }
              onRemoveInput={() => this.removePromoInput()}
              onAddValue={(text, index) => this.addCodeData(text, index)}
              onConfirm={() => this.submitPromoCode()}
            />
          </ScrollView>
        </View>
      </Modal>
    );
  };

  submitPromoCode = () => {
    const { promoCodes, validPromoCodes, validCodeList } = this.state;

    validPromoCodes.forEach((e) => {
      promoCodes.forEach((p) => {
        if (e.promo === p.text) {
          validCodeList.push(p.text);
        }
      });
    });

    validCodeList.length < promoCodes.length
      ? this.setState({
          isPromoError: !this.state.isPromoError,
          validCodeList,
        })
      : this.setState({ isPromoError: false, validCodeList: [] });
  };

  __renderItems = () => {
    const { items } = this.state;

    return items.map((item) => (
      <Card style={styles.cartContainer}>
        <View style={styles.cartBx}>
          <Image
            resizeMode="cover"
            style={styles.productImg}
            source={require("../../Assets/bk_img.jpg")}
          />
          <View style={styles.cartDetailBx}>
            <Text style={styles.itemNameTxt}>{item.productname}</Text>
            <Text style={styles.itemdescTxt}>
              {getTextToTranslate("", "Size")}: {item.productsize}{" "}
              {getTextToTranslate("", "Color")}: {item.productcolor}
            </Text>
            <View style={styles.qtyCalBx}>
              <Text style={styles.itemQtyTxt}>
                {getTextToTranslate("", "Quantity")}: {item.productquantity}
              </Text>
              <Counter
                quantity={item.productquantity}
                key={item.id}
                onIncrement={() => this.handleQtyIncrement(item)}
                onDecrement={() => this.handleQtyDecrement(item)}
              />
            </View>
          </View>
          <>
            {this.state.isDelete && this.state.currentItem === item.id ? (
              <View style={styles.delOptionContainer}>
                <FontAwesomeIcon
                  style={styles.delIconBtn}
                  name="trash"
                  onPress={() => this.handleItemRemove(item)}
                />
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      isDelete: !this.state.isDelete,
                      currentItem: null,
                    })
                  }
                >
                  <Text style={styles.delOptionTxt}>Not this time?</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.prContainer}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      isDelete: !this.state.isDelete,
                      currentItem: item.id,
                    })
                  }
                >
                  <Text style={styles.menuDotsDel}>. . .</Text>
                </TouchableOpacity>
                <Text style={styles.itemPriceBx}>
                  ${(item.productprice * item.productquantity).toFixed(2)}
                </Text>
                <TouchableOpacity style={styles.saleItemBtn}>
                  <Text style={styles.saleTxtClr}>Sale item</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        </View>
      </Card>
    ));
  };

  render() {
    const { isAddPromo, isCheckout } = this.state;
    const { GradientColors } = Theme(this.props.user.gender);

    return (
      <MyBody title={getTextToTranslate("", "Cart")}>
        {this.handlePromos()}
        {this.handleCheckout()}
        <ScrollView
          ref={(el) => {
            this.scroll = el;
          }}
        >
          <View style={styles.container}>
            {this.__renderItems()}

            <View style={styles.totalBx}>
              <View style={styles.totalDesc}>
                <Text style={styles.totalDescTxt}>
                  {getTextToTranslate("", "Total Price")}: $
                  {this.calculateTotalPrice()}
                </Text>
                <View style={styles.promoBx}>
                  <Text>Have a promo code?</Text>
                  <TouchableOpacity
                    style={styles.addPromoBtn}
                    onPress={() => {
                      this.setState({ isAddPromo: !isAddPromo });
                    }}
                  >
                    <Text>Add promo</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <TouchableOpacity
                  style={styles.checkoutBtn}
                  onPress={() => {
                    this.setState({ isCheckout: !isCheckout });
                  }}
                >
                  <LinearGradient
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    colors={GradientColors}
                    style={styles.linearGradient}
                  />
                  <Text style={styles.saleTxtClr}>Checkout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </MyBody>
    );
  }
}

const mapStateToProps = ({ authentication: { user } }) => ({
  user,
});

const mapDispatchToProps = (dispatch) => ({
  GeneralMiddleware: (data) => dispatch(GMiddleware.fetch(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cart);
