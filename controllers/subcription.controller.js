import { workflowClient } from '../config/upstash.js';
import Subscription from '../models/subscription.model.js';

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:8080';

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id
    });

    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body:{
        subscriptionId: subscription.id,
      },
      headers: {
        'content-type': 'application/json',
      },
      retries:0,
    })

    res.status(201).json({success: true, data: subscription,workflowRunId});
    
  } catch (e) {
    next(e);
    
  }
};


export const getSubscriptions = async (req, res, next) => {
  try {
    if(req.user.id !== req.params.id) {
      const error = new Error('You are not the owner of this account');
      error.status = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({user: req.params.id});
    res.status(200).json({success: true, data: subscriptions});

  } catch (e) {
    next(e);
    
  }
};