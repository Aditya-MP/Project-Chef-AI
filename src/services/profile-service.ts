"use client";

import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, orderBy, limit, getDocs, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Profile } from '@/store/profile-store';

const USERS_COLLECTION = 'users';

export interface ActivityItem {
  id?: string;
  title: string;
  time?: string; // We'll compute this using real dates
  timestamp: Date;
  type: 'recipe' | 'favorite' | 'cooked' | 'plan';
}

export interface MealPlanItem {
  id?: string;
  day: string;
  date: string;
  meal: string;
  recipe: string;
  status: 'planned' | 'cooked' | 'skipped';
  timestamp: Date;
}

export async function getUserProfile(uid: string): Promise<Profile | null> {
  const docRef = doc(db, USERS_COLLECTION, uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as Profile;
  } else {
    console.log("No such document!");
    return null;
  }
}

export async function createUserProfile(uid: string, profileData: Partial<Profile>) {
  const docRef = doc(db, USERS_COLLECTION, uid);
  await setDoc(docRef, {
    ...profileData,
    stats: {
      totalRecipes: 0,
      cookedRecipes: 0,
      successRate: 0,
    }
  });
}


export async function saveUserProfile(uid: string, profileData: Profile) {
  const docRef = doc(db, USERS_COLLECTION, uid);
  await updateDoc(docRef, {
    ...profileData
  });
}

export async function incrementStat(uid: string, statName: 'totalRecipes' | 'cookedRecipes' | 'successRate', amount: number = 1) {
  const docRef = doc(db, USERS_COLLECTION, uid);
  await updateDoc(docRef, {
    [`stats.${statName}`]: increment(amount)
  });
}

export async function logActivity(uid: string, activity: Omit<ActivityItem, 'id' | 'timestamp'>) {
  const activitiesRef = collection(db, USERS_COLLECTION, uid, 'activities');
  await addDoc(activitiesRef, {
    ...activity,
    timestamp: new Date()
  });
}

export async function getActivities(uid: string): Promise<ActivityItem[]> {
  const activitiesRef = collection(db, USERS_COLLECTION, uid, 'activities');
  const q = query(activitiesRef, orderBy('timestamp', 'desc'), limit(100));
  const querySnapshot = await getDocs(q);

  const activities: ActivityItem[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    activities.push({
      id: doc.id,
      ...data,
      timestamp: data.timestamp.toDate()
    } as ActivityItem);
  });
  return activities;
}

export async function addMealPlan(uid: string, plan: Omit<MealPlanItem, 'id' | 'timestamp'>) {
  const plansRef = collection(db, USERS_COLLECTION, uid, 'meal_plans');
  await addDoc(plansRef, {
    ...plan,
    timestamp: new Date()
  });
}

export async function getMealPlans(uid: string): Promise<MealPlanItem[]> {
  const plansRef = collection(db, USERS_COLLECTION, uid, 'meal_plans');
  // Order ascending by timestamp so the earliest meals come up first
  const q = query(plansRef, orderBy('timestamp', 'asc'), limit(7));
  const querySnapshot = await getDocs(q);

  const plans: MealPlanItem[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    plans.push({
      id: doc.id,
      ...data,
      timestamp: data.timestamp.toDate()
    } as MealPlanItem);
  });
  return plans;
}
