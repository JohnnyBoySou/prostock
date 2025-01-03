import React, { useEffect, useState } from "react";
import { Column, Row, Title, Label, Button } from "@theme/global";
import { FlatList, Pressable } from "react-native";
import { addMangasToCollection, listCollections } from "@hooks/collections";
import { MotiImage, MotiView } from "moti";
import { useNavigation } from "@react-navigation/native";
import { Feather, Ionicons } from "@expo/vector-icons";

export default function ModalAddCollection({ item }) {
  const navigation = useNavigation();
  const manga = item;
  const [data, setData] = useState([]);
  useEffect(() => {
    listCollections().then((res) => {
      setData(res);
    })
  }, [])

  return (
    <Column style={{ paddingHorizontal: 20, }}>
      <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, }}>
        <Title style={{ fontSize: 24, letterSpacing: -1, }}>Minhas coleções</Title>
        <Button onPress={() => { navigation.navigate('Collections') }} style={{ paddingHorizontal: 18, paddingVertical: 8, borderRadius: 100, backgroundColor: "#f6f6f6", }}>
          <Title style={{ color: "#000", fontSize: 16, }}>Criar nova</Title>
        </Button>
      </Row>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListFooterComponent={<Column style={{ width: 20, height: 30,}} />}
        style={{ alignSelf: "center" }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <CollectionItem item={item} manga={manga} />}
      />

    </Column>
  );
}



const CollectionItem = ({ item, manga }) => {
  const [sucess, setsucess] = useState();
  const [error, seterror] = useState('Adicionar?');
  const [disabled, setdisabled] = useState();
  const [select, setSelect] = useState();
  const addManga = async () => {
    const res = await addMangasToCollection(select, manga);
    if(res){
      setsucess(true)
      setdisabled(true)
      seterror('Pronto!')
    } else {
      setsucess(false)
      setdisabled(true)
      seterror('Já foi adicionado')
    }
  }


  if (item?.id === select) {
    const cl = sucess === true ? "#27AE60" : sucess === false ? "#EB5757" : "#f6f6f6";
    return (
      <Column>
        <Pressable disabled={disabled} onPress={addManga} style={{ backgroundColor: cl, borderRadius: 6, width: 130, height: 130, margin: 10, justifyContent: 'center', alignItems: 'center', }}>
          {sucess === true &&
            <MotiView style={{ justifyContent: 'center', alignItems: 'center', }} from={{ opacity: 0, translateY: 20, }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'spring', }}>
              <Feather name="check" size={54} color="#fff" />
            </MotiView>}
          {sucess === false && <MotiView style={{ justifyContent: 'center', alignItems: 'center', }} from={{ opacity: 0, rotate: '22deg' }} animate={{ opacity: 1, rotate: '0deg' }} transition={{ type: 'spring', }}>
            <Feather name="x" size={54} color="#fff" />
          </MotiView>}
          {sucess === undefined && <MotiView from={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', duration: 350, }}>
            <Ionicons name="add-outline" size={54} color="#27AE60" />
          </MotiView>}
        </Pressable>
        <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0, }}>
          <Label style={{ textAlign: 'center', fontSize: 16, marginBottom: 12, marginTop: -4, }}>{error}</Label>
        </MotiView>
      </Column>

    )
  }
  else {
    return (
      <Pressable onPress={() => { setSelect(item.id) }} style={{ margin: 10, borderRadius: 8, }}>
        <Column style={{ justifyContent: 'center', alignItems: 'center', width: 32, height: 32, borderRadius: 100, backgroundColor: "#f6f6f6", position: 'absolute', top: 5, right: 5, }}>
          <Label style={{ fontSize: 12, color: '#000', }}>{item?.mangas?.length}</Label>
        </Column>
        <MotiImage source={{ uri: item.capa }} style={{ width: 130, height: 130, borderRadius: 8, }} />
        <Title style={{ fontSize: 18, letterSpacing: -1, textAlign: 'center', marginTop: 5,}}>{item?.name?.length > 12 ? item?.name?.slice(0, 12) + '...' : item?.name}</Title>
      </Pressable>
    )
  }
}