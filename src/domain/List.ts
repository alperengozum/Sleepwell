import React from "react";

export interface List {
  name: string | number;
  type: ListType;
  desc?: string | number | boolean;
  icon?: React.ReactNode;
  id?: number;
  onClick?: () => void;
}

export interface InfoList extends List {
  link?: string;
  buttonText?: string;
}

export enum ListType {
  HEADER,
  ITEM
}
