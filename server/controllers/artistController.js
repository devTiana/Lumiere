import asyncHandler from 'express-async-handler';
import Artist from '../models/artist.js';
import Product from '../models/product.js';

// @desc   Create a Artist
// @route  POST /api/artists
// @access Private/Admin
const createArtist = asyncHandler(async (req, res) => {
  // 작가 등록 시, 작품 하나 필수 등록
  const { artist, product } = req.body;
  const newArtist = await Artist.create(artist);
  await Product.create({
    ...product,
    artist: { id: newArtist._id, name: newArtist.name },
  });
  res.status(201).json({
    code: newArtist.code,
    name: newArtist.name,
    aka: newArtist.aka,
    record: newArtist.record,
    joinAt: newArtist.joinAt,
    countOfWorks: newArtist.countOfWorks,
  });
});

// @desc   Fetch all Artists
// @route  GET /api/artists
// @access Public
const getArtists = asyncHandler(async (req, res) => {
  const artists = await Artist.find({}, { likes: 0 });
  res.json(artists);
});

// @desc    Update a Artist
// @route   PATCH /api/artists/:id
// @access  Private/Admin
const updateArtist = asyncHandler(async (req, res) => {
  const updatedArtist = await Artist.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  res.json({
    code: updatedArtist.code,
    name: updatedArtist.name,
    aka: updatedArtist.aka,
    record: updatedArtist.record,
    joinAt: updatedArtist.joinAt,
    countOfWorks: updatedArtist.countOfWorks,
  });
});

// @desc   Fetch single Artist
// @route  GET /api/artists/:id
// @access Public & private
const getArtistById = asyncHandler(async (req, res) => {
  const artistDetail = await Artist.findById(req.params.id, {
    name: 1,
    aka: 1,
    record: 1,
  });

  if (!artistDetail) {
    res.status(404).json({ message: '해당 작가가 존재하지 않습니다' });
  } else {
    const products = await Product.find(
      { 'artist.id': req.params.id },
      { image: 1, inStock: 1 }
    )
      .sort({ updatedAt: 1 })
      .exec(); // 최신순 나열

    if (req.query.userId) {
      // 로그인 유저라면 찜 유무도 알려주기
      let boolean;
      const exist = await Artist.findOne({ likes: req.query.userId });

      exist ? (boolean = true) : (boolean = false);
      res.json({ artistDetail, like: boolean, products });
    } else res.json({ artistDetail, products });
  }
});

// @desc   Zzim the artist
// @route  PATCH /api/artists/like
// @access Private
const likeArtist = asyncHandler(async (req, res) => {
  const { like } = req.body;
  if (!like) res.status(404).json({ message: 'true? of false?' });
  else {
    if (like === 'true') {
      await Artist.findByIdAndUpdate(
        req.body.artistId,
        {
          $push: { likes: req.user._id },
        },
        { new: true, upsert: true }
      ); // likes 배열에 유저 고유 아이디 넣기

      res.json({ message: '해당 작가 찜 완료' });
      return;
    }
    if (like === 'false') {
      await Artist.findByIdAndUpdate(
        req.body.artistId,
        {
          $pull: { likes: req.user._id },
        },
        { new: true }
      ); // likes 배열에 유저 고유 아이디 제거

      res.json({ message: '해당 작가 찜 해제' });
      return;
    }
  }
});

export { createArtist, getArtists, updateArtist, getArtistById, likeArtist };