/*
 * @Description:
 * @Author: ahl
 * @Date: 2021-10-14 14:10:33
 * @LastEditTime: 2021-10-15 11:22:47
 */

import { ref } from 'vue';

export const modalTransition = function () {
  const TransitionState = {
    Enter: 'enter',
    Entering: 'entering',
    Leave: 'leave',
    Leaving: 'leavng'
  };

  const overlayTransitionState = ref();
  const modalTransitionState = ref();

  const beforeOverlayEnter = () => {
    overlayTransitionState.value = TransitionState.Entering;
  };
  const afterOverlayEnter = () => {
    overlayTransitionState.value = TransitionState.Enter;
  };
  const beforeOverlayLeave = () => {
    overlayTransitionState.value = TransitionState.Leaving;
  };
  const afterOverlayLeave = () => {
    overlayTransitionState.value = TransitionState.Leave;
  };
  const beforeModalEnter = () => {
    modalTransitionState.value = TransitionState.Entering;
  };
  const afterModalEnter = (fun: () => void) => {
    modalTransitionState.value = TransitionState.Enter;
    fun();
  };
  const beforeModalLeave = () => {
    modalTransitionState.value = TransitionState.Leaving;
  };
  const afterModalLeave = (fun: () => void) => {
    modalTransitionState.value = TransitionState.Leave;
    fun();
  };

  return {
    TransitionState,
    overlayTransitionState,
    modalTransitionState,
    beforeOverlayEnter,
    afterOverlayEnter,
    beforeOverlayLeave,
    afterOverlayLeave,
    beforeModalEnter,
    afterModalEnter,
    beforeModalLeave,
    afterModalLeave
  };
};
