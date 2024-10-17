import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import COLORS from '../assets/colors/Colors';
import { FONTFAMILY } from '../../assets/fonts';
import { service_type } from '../model/service_type';

interface ServiceType {
    _id: string;
    service_type_name: string;
    service_type_icon: string;
}

const CardServiceComponent = () => {
    const [typeService, setTypeService] = useState<ServiceType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const getDataService_Type = async () => {
        try {
            const res = await serviceAPI.HandleService('/get-service-type');
            const data: ServiceType[] = await res.data;
            setTypeService(data);
            setLoading(false);
        } catch (error) {
            console.log('Error fetching service types: ', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        getDataService_Type();
    }, []);

    const renderItem = ({ item }: { item: ServiceType }) => (
        <TouchableOpacity style={styles.card}>
            <Image source={{ uri: item.service_type_icon }} style={styles.icon} />
            <Text style={styles.serviceName}>{item.service_type_name}</Text>
        </TouchableOpacity>
    );
  };

    return (
        <TouchableOpacity>
            <View style={styles.container}>
                {loading ? (
                    <ActivityIndicator size="large" color={COLORS.OCEAN_BLUE} />
                ) : (
                    <FlatList
                        data={typeService}
                        renderItem={renderItem}
                        keyExtractor={(item) => item._id}
                        numColumns={3}
                        columnWrapperStyle={styles.row}
                    />
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom:15,
  },
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '31%',
    marginBottom: 10,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  serviceName: {
    color: COLORS.OCEAN_BLUE,
    fontFamily: FONTFAMILY.montserrat_medium,
    textAlign: 'center',
    fontSize: 12,
  },
  invisibleCard: {
    backgroundColor: 'transparent', 
  },
});

export default CardServiceComponent;
