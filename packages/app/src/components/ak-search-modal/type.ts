import {Component, VNode} from "vue";

export interface SchemaItem {
    field: string,
    label: string,
    is: Component | VNode,
    props: Object,
}


export interface Props {
    schema: SchemaItem[]
}