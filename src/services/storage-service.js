const { createClient } = require('@supabase/supabase-js');
const pool = require("../config/db");

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
)

exports.checkProfileImage = async (userId) => {
    const query = {
        text: 'SELECT image_url FROM users WHERE user_id = $1',
        values: [userId]
    }
    const result = await pool.query(query);
    return result.rows[0].image_url;
}

exports.uploadProfile = async ({ file, userId }) => {
    try {
        const timeStamp = Date.now();
        const fileName = `user-${userId}/${timeStamp}`;
        console.log(fileName)
        const checkImageUrl = await this.checkProfileImage(userId);
        if (checkImageUrl) {
            if (!checkImageUrl.includes('default.jpg')) {
                const oldImageUrl = checkImageUrl.split('/avatar/').pop();
                await supabase.storage.from('avatar').remove([oldImageUrl])
            }
        }
        await supabase.storage.from('avatar').upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: true
        });
        const { data: publicUrlData } = supabase
            .storage
            .from('avatar')
            .getPublicUrl(fileName);
        return publicUrlData.publicUrl;
    } catch (error) {
        throw error
    }
}

exports.deleteFolder = async (userId) => {
    try {
        const folderPath = `user-${userId}`;

        const { data: files, error: listError } = await supabase.storage
            .from('avatar')
            .list(folderPath);

        if (listError) {
            throw listError;
        }

        if (!files || files.length === 0) {
            return;
        }
        const filePathsToRemove = files.map(file => `${folderPath}/${file.name}`);
        await supabase.storage.from('avatar').remove(filePathsToRemove);
    } catch (error) {
        throw error
    }
}
