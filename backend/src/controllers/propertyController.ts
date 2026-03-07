/**
 * Property controller - list, create, search, get by id
 */
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as PropertyModel from '../models/Property';
import { PropertyType, ListingIntent } from '../types';

export const search = async (req: AuthRequest, res: Response): Promise<void> => {
  const {
    location_city,
    location_country,
    min_price,
    max_price,
    property_type,
    intent,
    verified_only,
    limit,
    offset,
  } = req.query;
  const results = await PropertyModel.search({
    location_city: location_city as string,
    location_country: location_country as string,
    min_price: min_price != null ? Number(min_price) : undefined,
    max_price: max_price != null ? Number(max_price) : undefined,
    property_type: property_type as PropertyType | undefined,
    intent: intent as ListingIntent | undefined,
    verified_only: verified_only === 'true',
    limit: limit != null ? Number(limit) : undefined,
    offset: offset != null ? Number(offset) : undefined,
  });
  res.json({ properties: results });
};

export const getById = async (req: AuthRequest, res: Response): Promise<void> => {
  const property = await PropertyModel.findById(req.params.id, true);
  if (!property) {
    res.status(404).json({ error: 'Property not found' });
    return;
  }
  res.json(property);
};

export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  const {
    title,
    description,
    property_type,
    intent,
    price,
    currency,
    location_address,
    location_city,
    location_country,
    images,
  } = req.body;
  const property = await PropertyModel.create({
    owner_id: req.user.userId,
    title,
    description,
    property_type,
    intent,
    price,
    currency,
    location_address,
    location_city,
    location_country,
    images: Array.isArray(images) ? images : [],
  });
  res.status(201).json(property);
};

export const update = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  const updated = await PropertyModel.update(req.params.id, req.user.userId, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Property not found or not owned by you' });
    return;
  }
  res.json(updated);
};

export const myListings = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  const list = await PropertyModel.findByOwner(req.user.userId);
  res.json({ properties: list });
};
