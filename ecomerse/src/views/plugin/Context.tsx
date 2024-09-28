// import React, { createContext, useContext, useState } from 'react';

import { createContext } from "react";

type CartContextType = 0;


// Cart Context
export const CartContext = createContext<CartContextType>( 0 );


// Profile Context
export const ProfileContext = createContext({});