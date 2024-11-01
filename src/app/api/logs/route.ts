// src/app/api/logs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Log from '../../../../models/Log';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const user = await getToken(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    let query: any = { isDeleted: false };
    
    // Role-based access
    if (user.role !== 'admin') {
      query.userId = user.id;
    }

    // Apply filters
    const actionType = searchParams.get('actionType');
    if (actionType) {
      query.actionType = actionType;
    }

    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const logs = await Log.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username');

    const total = await Log.countDocuments(query);

    return NextResponse.json({
      logs,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching logs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const user = await getToken(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const log = new Log({
      actionType: body.actionType,
      userId: user.id,
      userRole: user.role,
      metadata: body.metadata
    });

    await log.save();
    
    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating log' },
      { status: 400 }
    );
  }
}