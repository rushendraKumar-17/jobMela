import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animations
const spin = keyframes`
  0% {
    transform: rotate(0deg);
    border-top-color: #ff6b6b;
  }
  25% {
    border-top-color: #4ecdc4;
  }
  50% {
    border-top-color: #45b7d1;
  }
  75% {
    border-top-color: #96ceb4;
  }
  100% {
    transform: rotate(360deg);
    border-top-color: #ff6b6b;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(0.95);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.8;
  }
`;

// Styled components
const LoaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
  z-index: 9999;
`;

const Spinner = styled.div`
  width: ${props => props.size || '80px'};
  height: ${props => props.size || '80px'};
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  position: relative;
  animation: ${spin} 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite,
    ${pulse} 2s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 50%;
    border: 4px solid transparent;
    border-top-color: #ff6b6b;
    border-bottom-color: #4ecdc4;
    animation: ${spin} 2s cubic-bezier(0.4, 0, 0.2, 1) infinite reverse;
    filter: drop-shadow(0 0 8px rgba(78, 205, 196, 0.3));
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60%;
    height: 60%;
    background: radial-gradient(circle, 
      rgba(255, 255, 255, 0.9) 30%,
      rgba(255, 255, 255, 0.6) 100%);
    border-radius: 50%;
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
  }
`;

const LoadingText = styled.div`
  position: absolute;
  bottom: -50px;
  font-family: 'Segoe UI', sans-serif;
  font-weight: 600;
  color: #2d3436;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 0.9em;
  animation: ${pulse} 2s ease-in-out infinite;
`;

// Component
const AwesomeLoader = ({ 
  size = '80px',
  text = 'Loading...',
  colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4']
}) => {
  return (
    <LoaderContainer>
      <Spinner size={size}>
        <LoadingText>{text}</LoadingText>
      </Spinner>
    </LoaderContainer>
  );
};

export default AwesomeLoader;
