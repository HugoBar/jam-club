class SongController {
    static getAllSongs(req, res) {
      // Fetch songs data from your database or any other source
      const songs = [
        // Sample song data
        { name: 'John Doe', email: 'john@example.com' },
        { name: 'Jane Smith', email: 'jane@example.com' },
      ];
  
      res.json({ songs });
    }
  
    // Add more methods for handling song-related functionality
  }
  
  module.exports = SongController;