import express from "express";

declare global {
  namespace Express {
    interface Request {
      signInUserSub?: `${string}-${string}-${string}-${string}-${string}`;
    }
  }
}
