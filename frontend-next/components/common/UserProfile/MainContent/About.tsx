/*
 * The text written by the user about herself is placed in this file
 */

import React from 'react';
// components
import Title from './Title';

const About: React.FC<any> = ({data}) => {
  const {mission} = data;

  return (
    <div className="px-4 border-t border-grayLineBased ">
      <Title>About</Title>
      <p className="text-graySubtitle w-4/6 mb-4 text-base">{mission}</p>
    </div>
  );
};

export default About;
