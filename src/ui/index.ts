import { Dimensions } from "react-native";
import { Column, Row, Main,  ScrollHorizontal, ScrollVertical,  } from "./layout";
import Button from "./button";
import Avatar from "./avatar";
import Skeleton from "./skeleton";
import Switch from "./switch";
import Input from "./input";
import Search from './search'
import colors from "./colors";
import Message from "./message";
import Sheet from './sheet';
import Select from './select';
import Loader from './loader';
import Image from './image';
import Medida from "./medida";
import { Title, HeadTitle, Label, SubLabel, U, Description } from "./text";
import Tabs from "./tabs";
import Status from "./status";
import Users from "./users";
import Form from './form';
import Tipo from './tipo';
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import fields from './fields';
import validations from "./validation";
import TextArea from "./textarea";
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
import ListSearch from "./ListSearch";
import ListSearchStore from './ListSearchStore'
export {
    useQuery, useInfiniteQuery,
    Column, Row, Main, ScrollHorizontal, ScrollVertical,
    Title, HeadTitle, Label, SubLabel, U, Description,
    Button, Avatar, Switch, colors,
    Skeleton,
    Tabs,
    SCREEN_WIDTH, SCREEN_HEIGHT,
    Input, Message,
    Sheet, Select, Loader,
    Image, Medida, Users, Tipo,
    Status, fields, validations, Form, TextArea, Search, ListSearch, ListSearchStore
}
    
