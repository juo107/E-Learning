using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using Elearn.Infrastructure.Data;
using Elearn.Infrastructure.Repository.Interfaces;
using Elearn.Domain;

namespace Elearn.Infrastructure.Repository.Implementations
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private readonly ElearnDbContext _context;
        private readonly DbSet<T> _dbSet;

        public GenericRepository(ElearnDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            var query = _dbSet.AsQueryable();
            
            // Apply soft delete filter if entity implements ISoftDeletable
            if (typeof(ISoftDeletable).IsAssignableFrom(typeof(T)))
            {
                query = query.Where(e => !((ISoftDeletable)e).IsDeleted);
            }
            
            return await query.ToListAsync();
        }

        public async Task<IEnumerable<T>> GetAllWithIncludesAsync(params Expression<Func<T, object>>[] includes)
        {
            var query = _dbSet.AsQueryable();
            
            // Apply includes
            foreach (var include in includes)
            {
                query = query.Include(include);
            }
            
            // Apply soft delete filter if entity implements ISoftDeletable
            if (typeof(ISoftDeletable).IsAssignableFrom(typeof(T)))
            {
                query = query.Where(e => !((ISoftDeletable)e).IsDeleted);
            }
            
            return await query.ToListAsync();
        }

        public async Task<T?> GetByIdAsync(Guid id)
        {
            var entity = await _dbSet.FindAsync(id);
            
            // Check soft delete if entity implements ISoftDeletable
            if (entity != null && typeof(ISoftDeletable).IsAssignableFrom(typeof(T)))
            {
                if (((ISoftDeletable)entity).IsDeleted)
                    return null;
            }
            
            return entity;
        }

        public async Task<T?> GetByIdWithIncludesAsync(Guid id, params Expression<Func<T, object>>[] includes)
        {
            var query = _dbSet.AsQueryable();
            
            // Apply includes
            foreach (var include in includes)
            {
                query = query.Include(include);
            }
            
            var entity = await query.FirstOrDefaultAsync(e => EF.Property<Guid>(e, "Id") == id);
            
            // Check soft delete if entity implements ISoftDeletable
            if (entity != null && typeof(ISoftDeletable).IsAssignableFrom(typeof(T)))
            {
                if (((ISoftDeletable)entity).IsDeleted)
                    return null;
            }
            
            return entity;
        }

        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public void Update(T entity)
        {
            _dbSet.Update(entity);
        }

        public void Delete(T entity)
        {
            // Soft delete if entity implements ISoftDeletable
            if (typeof(ISoftDeletable).IsAssignableFrom(typeof(T)))
            {
                ((ISoftDeletable)entity).IsDeleted = true;
                _dbSet.Update(entity);
            }
            else
            {
                _dbSet.Remove(entity);
            }
        }

        public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        {
            var query = _dbSet.Where(predicate);
            
            // Apply soft delete filter if entity implements ISoftDeletable
            if (typeof(ISoftDeletable).IsAssignableFrom(typeof(T)))
            {
                query = query.Where(e => !((ISoftDeletable)e).IsDeleted);
            }
            
            return await query.ToListAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
