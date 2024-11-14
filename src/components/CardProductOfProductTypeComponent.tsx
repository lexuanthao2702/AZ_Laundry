import { View, TouchableOpacity, Image, ActivityIndicator, FlatList, Animated } from 'react-native';
import React from 'react';
import { ProductModel } from '../model/product';
import { CartModel } from '../model/cart_model';
import COLORS from '../assets/colors/Colors';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import { FONTFAMILY } from '../../assets/fonts';
import { AddSquare, Minus } from 'iconsax-react-native';
import { useAxiosAddCart } from '../hooks/useAxiosAddCart';
import { useSelector } from 'react-redux';
import { authSelector } from '../redux/reducers/authReducer';
import { useRole } from '../permission/permission';
import SectionComponent from './SectionComponent';
import { Swipeable } from 'react-native-gesture-handler';
import IMAGES from '../assets/images/Images';
import { log } from 'console';

interface Props {
    products?: ProductModel[];
    carts?: CartModel[];
    isLoading?: boolean;
    isCart?: boolean;
    onPressMinus?: (data: CartModel) => void ;
    onPressPlus?: (data: CartModel) => void ;
    onPressDelete?: (data: CartModel) => void ;
    onPress:(item:any)=>void,

}

const CardProductOfProductType = (props: Props) => {
    const user = useSelector(authSelector);
    const { isUser } = useRole();
    const { products, carts, isLoading, isCart,onPressMinus, onPressPlus ,onPressDelete,onPress} = props;
    const renderRightActions = (item:CartModel) => (
        (progressAnimatedValue: Animated.AnimatedInterpolation<string | number>, dragAnimatedValue: Animated.AnimatedInterpolation<string | number>) => (
            <TouchableOpacity onPress={() => onPressDelete && onPressDelete(item)}>
                <SectionComponent
                    styles={{
                        backgroundColor: COLORS.RED,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 75,
                        height: '85%',
                        borderRadius: 10,
                    }}>
                    <TextComponent text={'Xoá'}  font={FONTFAMILY.montserrat_medium}/>
                </SectionComponent>
            </TouchableOpacity>
        )
    );
    const renderCartItem = ({ item }: { item: CartModel }) => (
        <Swipeable renderRightActions={renderRightActions(item)}>
            <TouchableOpacity style={{ marginBottom: 15, backgroundColor: COLORS.WHITE, padding: 8, borderRadius: 16 }} onPress={() => onPress(item)}>
                <RowComponent>
                    <Image source={item?.id_product?.product_photo[0]?{ uri: item?.id_product?.product_photo[0] } : IMAGES.loading_image} style={{ width: 80, height: 80, borderRadius: 8 }} />
                    <View style={{ width: '78%', paddingHorizontal: 10 }}>
                        <TextComponent text={item.id_product?.product_name} color={COLORS.DARK_BLUE} font={FONTFAMILY.montserrat_bold} size={13} />
                        <TextComponent styles={{ paddingVertical: 3 }} text={item.id_product?.short_description} color={COLORS.HEX_LIGHT_GRAY} size={13} />
                        <RowComponent justify='space-between'>
                            <TextComponent text={`${item?.cart_subtotal} vnđ`} color={COLORS.HEX_BLACK} font={FONTFAMILY.montserrat_medium} />
                            <RowComponent justify='space-between'>
                                <TouchableOpacity onPress={()=>onPressMinus && onPressMinus(item)}>
                                    <Minus size={25} variant='Bold' color={COLORS.AZURE_BLUE} />
                                </TouchableOpacity>
                                <TextComponent text={item.product_quantity.toString()} color={COLORS.GRAY_WHITE} font={FONTFAMILY.montserrat_medium} styles={{ marginHorizontal: 5 }} />
                                <TouchableOpacity onPress={()=>onPressPlus && onPressPlus(item)}>
                                    <AddSquare size={25} variant='Bold' color={COLORS.AZURE_BLUE} />
                                </TouchableOpacity>
                            </RowComponent>
                        </RowComponent>
                    </View>
                </RowComponent>
            </TouchableOpacity>
        </Swipeable>
    );
    const renderProductItem = ({ item }: { item: ProductModel }) => (
        <TouchableOpacity style={{ marginBottom: 15, backgroundColor: COLORS.WHITE, padding: 8, borderRadius: 16 }} onPress={() => onPress(item)}>
            <RowComponent>
                <Image source={{ uri: item.product_photo[0] }} style={{ width: 80, height: 80, borderRadius: 8 }} />
                <View style={{ width: '78%', paddingHorizontal: 10 }}>
                    <TextComponent text={item.product_name} color={COLORS.DARK_BLUE} font={FONTFAMILY.montserrat_bold} size={13} />
                    <TextComponent styles={{ paddingVertical: 3 }} text={item.short_description} color={COLORS.HEX_LIGHT_GRAY} size={13} />
                    <RowComponent justify='space-between'>
                        <TextComponent text={`${item.product_price} vnđ`} color={COLORS.HEX_BLACK} font={FONTFAMILY.montserrat_medium} />
                        {isUser && (
                            <TouchableOpacity onPress={() => useAxiosAddCart({ id_product: item._id, id_user: user.id, cart_subtotal: item.product_price, product_quantity: 1 })}>
                                <AddSquare size={25} variant='Bold' color={COLORS.AZURE_BLUE} />
                            </TouchableOpacity>
                        )}
                    </RowComponent>
                </View>
            </RowComponent>
        </TouchableOpacity>
    );
    return (
        <View>
            {isLoading ? (
                <ActivityIndicator size="large" color={COLORS.OCEAN_BLUE} />
            ) : (
                isCart ? (
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{paddingBottom:300}}
                        data={carts} 
                        renderItem={renderCartItem} 
                        keyExtractor={(item) => item._id.toString()} 
                    />
                ) : (
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={products} 
                        renderItem={renderProductItem} 
                        keyExtractor={(item) => item._id.toString()} 
                    />
                )
            )}
        </View>
    );
};

export default CardProductOfProductType;
